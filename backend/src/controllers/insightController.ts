import { Request, Response } from 'express';
import { InsightModel } from '../models/Insight';
import { DismissedSuggestionModel } from '../models/DismissedSuggestion';
import { buildInsightData } from '../services/insightRulesService';
import { generateInsightNarrative } from '../services/geminiService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

const INSIGHT_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 jam

export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const cached = await InsightModel.findOne({ userId });
  const isFresh =
    !!cached &&
    Date.now() - cached.generatedAt.getTime() < INSIGHT_REFRESH_INTERVAL_MS;

  if (isFresh && cached) {
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
    { userId },
    {
      userId,
      generatedAt: new Date(),
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

    // Hilangkan juga dari cache yang sedang aktif supaya langsung hilang
    // di UI, tidak perlu nunggu refresh 1 jam berikutnya.
    await InsightModel.updateOne(
      { userId },
      { $pull: { suggestions: { conditionKey } } },
    );

    res.status(204).send();
  },
);
