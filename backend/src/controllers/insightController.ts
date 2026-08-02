import { Request, Response } from 'express';
import { InsightModel } from '../models/Insight';
import { DismissedSuggestionModel } from '../models/DismissedSuggestion';
import { buildInsightData } from '../services/insightRulesService';
import { generateInsightNarrative } from '../services/geminiService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const date = todayString();

  const cached = await InsightModel.findOne({ userId, date });
  if (cached) {
    res.json({
      widgetInsights: cached.widgetInsights,
      suggestions: cached.suggestions,
      affirmation: cached.affirmation,
    });
    return;
  }

  const { facts, candidates } = await buildInsightData(userId as string);

  const narrative = await generateInsightNarrative({
    facts: facts as unknown as Record<string, unknown>,
    candidateSummaries: candidates.map((c) => ({
      conditionKey: c.conditionKey,
      summary: c.summary,
    })),
  });

  // Gemini cuma nulis teksnya; action (label + route) tetap dari rule engine
  // supaya tidak ada risiko Gemini "mengarang" link yang salah/tidak valid.
  const suggestions = candidates.map((candidate) => {
    const matchedText = narrative.suggestionTexts.find(
      (t) => t.conditionKey === candidate.conditionKey,
    );
    return {
      conditionKey: candidate.conditionKey,
      text: matchedText?.text ?? candidate.summary,
      action: candidate.action,
    };
  });

  const affirmation = suggestions.length === 0 ? narrative.affirmation : null;

  const saved = await InsightModel.findOneAndUpdate(
    { userId, date },
    {
      userId,
      date,
      widgetInsights: narrative.widgetInsights,
      suggestions,
      affirmation,
    },
    { upsert: true, new: true },
  );

  res.json({
    widgetInsights: saved.widgetInsights,
    suggestions: saved.suggestions,
    affirmation: saved.affirmation,
  });
});

export const dismissSuggestion = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { conditionKey } = req.body as { conditionKey?: string };

    if (!conditionKey) {
      throw new AppError('conditionKey wajib diisi', 400);
    }

    await DismissedSuggestionModel.findOneAndUpdate(
      { userId, conditionKey },
      { userId, conditionKey },
      { upsert: true },
    );

    // Hilangkan juga dari cache hari ini supaya langsung hilang di UI,
    // tidak perlu nunggu regenerate besok.
    const date = todayString();
    await InsightModel.updateOne(
      { userId, date },
      { $pull: { suggestions: { conditionKey } } },
    );

    res.status(204).send();
  },
);
