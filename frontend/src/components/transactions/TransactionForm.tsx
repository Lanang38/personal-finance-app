import {
  FormEvent,
  ChangeEvent,
  useRef,
  useState,
} from 'react';
import { ChevronDown, ScanLine } from 'lucide-react';
import { Account, Category, TransactionType } from '../../types';
import { getErrorMessage } from '../../api/client';
import { scanReceiptRequest } from '../../api/receipts';
import { WarningModal } from '../warning/WarningModal';
import type { JSX } from 'react';

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (payload: {
    accountId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
  }) => Promise<void>;
}

function getToday(): string {
  const today = new Date();
  const offset = today.getTimezoneOffset();

  return new Date(today.getTime() - offset * 60000)
    .toISOString()
    .split('T')[0];
}

export function TransactionForm({
  accounts,
  categories,
  onSubmit,
}: TransactionFormProps): JSX.Element {
  const [type, setType] = useState<TransactionType>('expense');
  const [accountId, setAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(getToday());

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // ===== Receipt Scan =====
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanNotice, setScanNotice] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCategories = categories.filter(
    (category) => category.kind === type,
  );

  async function handleScanReceipt(
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];

    // reset supaya file yang sama bisa dipilih lagi
    event.target.value = '';

    if (!file) return;

    setIsScanning(true);
    setScanNotice('');
    setWarningMessage(null);

    try {
      const result = await scanReceiptRequest(file);

      // Receipt selalu dianggap transaksi pengeluaran
      setType('expense');

      if (result.total && result.total > 0) {
        setAmount(String(result.total));
      }

      if (result.merchant) {
        setDescription(result.merchant);
      }

      if (result.date) {
        setDate(result.date);
      }

      if (result.suggestedCategoryId) {
        setCategoryId(result.suggestedCategoryId);
      } else {
        setCategoryId('');
      }

      setScanNotice(
        result.suggestedCategoryId
          ? 'Struk berhasil dipindai. Periksa kembali datanya sebelum disimpan.'
          : `Struk berhasil dipindai. Kategori "${
              result.suggestedCategoryName ?? '-'
            }" belum tersedia, silakan pilih manual.`,
      );
    } catch (error) {
      setWarningMessage(getErrorMessage(error));
    } finally {
      setIsScanning(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!accountId || !categoryId || !amount || !date) {
      setWarningMessage(
        'Harap lengkapi semua data transaksi (kecuali catatan) sebelum menyimpan.',
      );
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setWarningMessage('Jumlah harus lebih besar dari 0.');
      return;
    }

    if (type === 'expense') {
      const selectedAccount = accounts.find(
        (account) => account.id === accountId,
      );

      if (selectedAccount && numericAmount > selectedAccount.balance) {
        setWarningMessage('Saldo akun tidak mencukupi untuk transaksi ini.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        accountId,
        categoryId,
        type,
        amount: numericAmount,
        description,
        date,
      });

      // Reset form
      setType('expense');
      setAccountId('');
      setCategoryId('');
      setAmount('');
      setDescription('');
      setDate(getToday());

      setScanNotice('');
    } catch (error) {
      setWarningMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-800">Tambah Transaksi</h2>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-brand-purple/10 px-3 py-2 text-sm font-semibold text-brand-purple transition hover:bg-brand-purple/20 disabled:opacity-60"
          >
            <ScanLine size={16} />
            {isScanning ? 'Memindai...' : 'Scan Struk'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleScanReceipt}
            className="hidden"
          />
        </div>

        {scanNotice && (
          <div className="rounded-xl bg-brand-purple/10 px-3 py-2 text-xs text-brand-purple">
            {scanNotice}
          </div>
        )}

        {/* Jenis transaksi */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategoryId('');
            }}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              type === 'expense'
                ? 'bg-brand-red text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Pengeluaran
          </button>

          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategoryId('');
            }}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              type === 'income'
                ? 'bg-brand-purple text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Pemasukan
          </button>
        </div>

        {/* Jumlah */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Jumlah (Rp)
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full appearance-none rounded-xl bg-slate-100 px-4 py-2.5 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        {/* Akun & Kategori */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Akun
            </label>

            <div className="relative">
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-100 py-2.5 pl-4 pr-9 outline-none"
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
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Kategori
            </label>

            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-100 py-2.5 pl-4 pr-9 outline-none"
              >
                <option value="">Pilih kategori</option>

                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Tanggal */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Tanggal
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl bg-slate-100 px-4 py-2.5 outline-none"
          />
        </div>

        {/* Catatan */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Catatan
          </label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opsional"
            className="w-full rounded-xl bg-slate-100 px-4 py-2.5 outline-none"
          />
        </div>

        {/* Simpan */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand-purple py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>

      {warningMessage && (
        <WarningModal
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </>
  );
}