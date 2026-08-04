// `resolution-mode` cuma valid di bentuk `import type { X } from "...";`,
// bukan di inline `import(...)` type query — makanya dipakai bentuk ini.
import type { GoogleGenAI } from '@google/genai' with {
  'resolution-mode': 'import',
};

type GoogleGenAIType = InstanceType<typeof GoogleGenAI>;

export interface GeminiSuggestionText {
  conditionKey: string;
  text: string;
}

export interface GeminiWidgetInsights {
  expenseTrend: string;
  expenseByCategory: string;
  incomeByCategory: string;
  accounts: string;
}

export interface GeminiInsightNarrative {
  widgetInsights: GeminiWidgetInsights;
  suggestionTexts: GeminiSuggestionText[];
  affirmation: string | null;
}

interface GenerateNarrativeInput {
  facts: Record<string, unknown>;
  candidateSummaries: { conditionKey: string; summary: string }[];
}

const FALLBACK_WIDGET_INSIGHTS: GeminiWidgetInsights = {
  expenseTrend: 'Belum ada cukup data bulan ini.',
  expenseByCategory: 'Belum ada cukup data pengeluaran.',
  incomeByCategory: 'Belum ada cukup data pemasukan.',
  accounts: 'Belum ada cukup data akun.',
};

// Client dibuat lewat dynamic import() dan di-cache supaya package
// cuma di-load sekali.
let clientPromise: Promise<GoogleGenAIType> | null = null;

async function getGeminiClient(): Promise<GoogleGenAIType> {
  if (!clientPromise) {
    clientPromise = import('@google/genai').then(
      ({ GoogleGenAI }) =>
        new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }),
    );
  }
  return clientPromise;
}

/**
 * Meminta Gemini menuliskan ulang fakta & kondisi (yang SUDAH diverifikasi
 * secara rule-based) menjadi kalimat Bahasa Indonesia yang natural.
 * Gemini TIDAK menentukan kondisi mana yang valid — itu tugas rule engine.
 */
export async function generateInsightNarrative(
  input: GenerateNarrativeInput,
): Promise<GeminiInsightNarrative> {
  const ai = await getGeminiClient();

  const conditionList =
    input.candidateSummaries.length > 0
      ? input.candidateSummaries
          .map((c) => `- [${c.conditionKey}] ${c.summary}`)
          .join('\n')
      : '(tidak ada kondisi apapun, semua aman)';

  const prompt = `
Kamu adalah asisten keuangan pribadi berbahasa Indonesia. Tugasmu HANYA menuliskan ulang data berikut menjadi kalimat yang natural dan ramah — JANGAN menambah fakta, angka, atau kondisi baru yang tidak ada di data.

DATA AGREGAT BULAN INI:
${JSON.stringify(input.facts, null, 2)}

KONDISI YANG SUDAH TERVERIFIKASI SISTEM:
${conditionList}

Instruksi output:
1. "widgetInsights": 4 kalimat SANGAT singkat (maksimal 60 karakter) untuk caption widget:
   - expenseTrend: tren pengeluaran bulan ini dibanding bulan lalu
   - expenseByCategory: highlight kategori pengeluaran terbesar
   - incomeByCategory: kondisi pemasukan
   - accounts: kondisi distribusi saldo antar akun
2. "suggestionTexts": untuk SETIAP baris di "KONDISI YANG SUDAH TERVERIFIKASI SISTEM" (kalau ada), tulis ulang jadi 1 kalimat saran actionable & ramah (maksimal 140 karakter). Sertakan "conditionKey" apa adanya, jangan diubah. Kalau tidak ada kondisi, kembalikan array kosong.
3. "affirmation": ISI HANYA kalau tidak ada kondisi sama sekali — 1 kalimat afirmasi positif singkat kalau kondisi keuangan user terpantau baik. Kalau ada kondisi, kembalikan null.

Balas HANYA JSON sesuai skema, tanpa markdown, tanpa penjelasan tambahan.
`.trim();

  let response: Awaited<
    ReturnType<GoogleGenAIType['models']['generateContent']>
  >;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            widgetInsights: {
              type: 'object',
              properties: {
                expenseTrend: { type: 'string' },
                expenseByCategory: { type: 'string' },
                incomeByCategory: { type: 'string' },
                accounts: { type: 'string' },
              },
              required: [
                'expenseTrend',
                'expenseByCategory',
                'incomeByCategory',
                'accounts',
              ],
            },
            suggestionTexts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  conditionKey: { type: 'string' },
                  text: { type: 'string' },
                },
                required: ['conditionKey', 'text'],
              },
            },
            affirmation: { type: 'string', nullable: true },
          },
          required: ['widgetInsights', 'suggestionTexts'],
        },
      },
    });
  } catch {
    // Panggilan ke Gemini gagal (API key salah, kuota habis, network,
    // dll) — jangan sampai seluruh request /insights ikut gagal.
    return {
      widgetInsights: FALLBACK_WIDGET_INSIGHTS,
      suggestionTexts: [],
      affirmation: null,
    };
  }

  try {
    const parsed = JSON.parse(
      response.text ?? '{}',
    ) as Partial<GeminiInsightNarrative>;
    return {
      widgetInsights: parsed.widgetInsights ?? FALLBACK_WIDGET_INSIGHTS,
      suggestionTexts: parsed.suggestionTexts ?? [],
      affirmation: parsed.affirmation ?? null,
    };
  } catch {
    // Kalau Gemini gagal/response tidak valid, jangan sampai seluruh
    // request gagal — fallback ke teks default yang aman.
    return {
      widgetInsights: FALLBACK_WIDGET_INSIGHTS,
      suggestionTexts: [],
      affirmation: null,
    };
  }
}
