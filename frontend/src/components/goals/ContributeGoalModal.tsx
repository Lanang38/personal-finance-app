import { useState, FormEvent } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Account, Goal } from '../../types';
import { getErrorMessage } from '../../api/client';
import { WarningModal } from '../alert/Warning';
import type { JSX } from 'react';

interface ContributeGoalModalProps {
  goal: Goal;
  accounts: Account[];
  onClose: () => void;
  onSubmit: (
    goalId: string,
    amount: number,
    accountId: string,
  ) => Promise<void>;
}

export function ContributeGoalModal({
  goal,
  accounts,
  onClose,
  onSubmit,
}: ContributeGoalModalProps): JSX.Element {
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id ?? '');
  const [amount, setAmount] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!accountId) {
      setWarningMessage('Sumber akun wajib dipilih');
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setWarningMessage('Nominal harus lebih besar dari 0');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(goal.id, numericAmount, accountId);
      onClose();
    } catch (error) {
      setWarningMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 shadow-lg w-full max-w-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-lg text-slate-800">
              Tambah Kontribusi
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-4 truncate">
            Untuk target &ldquo;{goal.name}&rdquo;
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Sumber Akun
              </label>
              <div className="relative">
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full appearance-none bg-slate-100 rounded-xl pl-4 pr-9 py-2.5 outline-none text-sm"
                >
                  <option value="">Pilih akun</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Nominal (Rp)
              </label>
              <input
                type="number"
                min={0}
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-100 rounded-xl px-4 py-2.5 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-brand-purple text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {warningMessage && (
        <WarningModal
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </>
  );
}
