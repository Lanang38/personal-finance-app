import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowRight, X, Sparkles } from 'lucide-react';
import { InsightSuggestion } from '../../types';
import type { JSX } from 'react';

interface SuggestionPanelProps {
  suggestions: InsightSuggestion[];
  affirmation: string | null;
  isLoading: boolean;
  onDismiss: (conditionKey: string) => Promise<void>;
}

export function SuggestionPanel({
  suggestions,
  affirmation,
  isLoading,
  onDismiss,
}: SuggestionPanelProps): JSX.Element {
  const navigate = useNavigate();
  const [locallyDismissed, setLocallyDismissed] = useState<Set<string>>(
    new Set(),
  );

  async function handleDismiss(conditionKey: string): Promise<void> {
    setLocallyDismissed((prev) => new Set(prev).add(conditionKey));
    await onDismiss(conditionKey);
  }

  const visibleSuggestions = suggestions.filter(
    (s) => !locallyDismissed.has(s.conditionKey),
  );

  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Rekomendasi untuk kamu
      </p>

      {isLoading ? (
        <p className="text-sm text-slate-400 dark:text-slate-100 py-4">
          Menganalisis data kamu...
        </p>
      ) : visibleSuggestions.length === 0 ? (
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-brand-purple mt-0.5 shrink-0" />
          <p className="text-sm text-slate-500 dark:text-slate-100">
            {affirmation ??
              'Keuangan kamu bulan ini terpantau baik, tidak ada yang perlu ditindaklanjuti.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-600">
          {visibleSuggestions.map((suggestion) => (
            <div
              key={suggestion.conditionKey}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Lightbulb
                size={16}
                className="text-brand-purple dark:text-brand-blue mt-0.5 shrink-0"
              />
              <p className="text-sm text-slate-600 dark:text-slate-100  flex-1">
                {suggestion.text}
              </p>

              {suggestion.action && (
                <button
                  type="button"
                  onClick={() => navigate(suggestion.action!.route)}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-purple dark:text-brand-blue bg-brand-purple/10 dark:bg-brand-blue/10 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition hover:opacity-90"
                >
                  {suggestion.action.label}
                  <ArrowRight size={12} />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDismiss(suggestion.conditionKey)}
                className="p-1 rounded-full hover:text-slate-400 text-slate-100 shrink-0 transition-colors"
                aria-label="Tutup saran ini"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
