import { useState } from 'react';
import {
  User,
  Palette,
  Bell,
  Wallet,
  Download,
  Info,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SettingsSection } from '../components/settings/SettingsSection';
import {
  SettingsNav,
  SettingsTabItem,
} from '../components/settings/SettingsNav';
import { ComingSoonBadge } from '../components/settings/ComingSoonBadge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { downloadTransactionsCsv } from '../api/export';
import type { JSX } from 'react';

type SettingsTabId =
  | 'profile'
  | 'appearance'
  | 'notifications'
  | 'preferences'
  | 'data'
  | 'about'
  | 'delete';

const TAB_ITEMS: SettingsTabItem[] = [
  { id: 'profile', label: 'Profil', icon: <User size={16} /> },
  { id: 'appearance', label: 'Tampilan', icon: <Palette size={16} /> },
  { id: 'notifications', label: 'Notifikasi', icon: <Bell size={16} /> },
  {
    id: 'preferences',
    label: 'Preferensi Keuangan',
    icon: <Wallet size={16} />,
  },
  { id: 'data', label: 'Data & Ekspor', icon: <Download size={16} /> },
  { id: 'about', label: 'Tentang', icon: <Info size={16} /> },
  {
    id: 'delete',
    label: 'Hapus Akun',
    icon: <Trash2 size={16} />,
    danger: true,
  },
];

export function SettingsPage(): JSX.Element {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  async function handleExport(): Promise<void> {
    setIsExporting(true);
    try {
      await downloadTransactionsCsv();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SettingsNav
            items={TAB_ITEMS}
            activeId={activeTab}
            onSelect={(id) => setActiveTab(id as SettingsTabId)}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
              <SettingsSection title="Profil">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-brand-purple text-white flex items-center justify-center font-semibold text-lg overflow-hidden shrink-0">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (user?.name.charAt(0) ?? '?').toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {user?.name}
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <ComingSoonBadge />
                </div>
              </SettingsSection>

              <SettingsSection title="Informasi Pribadi">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">
                      Nama
                    </p>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {user?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">
                      Email
                    </p>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection title="Keamanan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {user?.authProvider === 'google'
                        ? 'Masuk dengan Google'
                        : 'Password'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {user?.authProvider === 'google'
                        ? 'Dikelola oleh akun Google kamu'
                        : 'Ubah password login kamu'}
                    </p>
                  </div>
                  {user?.authProvider !== 'google' && <ComingSoonBadge />}
                </div>
              </SettingsSection>
            </>
          )}

          {activeTab === 'appearance' && (
            <SettingsSection
              title="Tampilan"
              description="Sesuaikan tema aplikasi"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Mode warna
                </p>
                <ThemeToggle />
              </div>
            </SettingsSection>
          )}

          {activeTab === 'notifications' && (
            <SettingsSection
              title="Notifikasi"
              description="Pengingat anggaran dan target tabungan"
            >
              <div className="flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Notifikasi push
                  </p>
                </div>
                <ComingSoonBadge />
              </div>
            </SettingsSection>
          )}

          {activeTab === 'preferences' && (
            <SettingsSection
              title="Preferensi Keuangan"
              description="Mata uang utama untuk semua laporan"
            >
              <div className="flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <Wallet size={18} className="text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Mata uang (IDR)
                  </p>
                </div>
                <ComingSoonBadge />
              </div>
            </SettingsSection>
          )}

          {activeTab === 'data' && (
            <SettingsSection
              title="Data & Ekspor"
              description="Kelola data keuanganmu"
            >
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-700/50 px-4 py-3 disabled:opacity-60"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <Download size={16} />
                  {isExporting ? 'Mengekspor...' : 'Export transaksi (CSV)'}
                </span>
              </button>
            </SettingsSection>
          )}

          {activeTab === 'about' && (
            <SettingsSection title="Tentang">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Versi aplikasi
                </span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  1.0.0
                </span>
              </div>
            </SettingsSection>
          )}

          {activeTab === 'delete' && (
            <SettingsSection
              title="Hapus Akun"
              description="Tindakan ini permanen dan tidak bisa dibatalkan"
            >
              <div className="flex items-center justify-between rounded-xl bg-red-50 dark:bg-red-500/10 px-4 py-3">
                <span className="flex items-center gap-3 text-sm font-medium text-brand-red">
                  <Trash2 size={16} />
                  Hapus akun beserta semua data transaksi, akun, anggaran, dan
                  target tabungan
                </span>
                <ComingSoonBadge />
              </div>
            </SettingsSection>
          )}

          <button
            type="button"
            onClick={logout}
            className="w-full text-center text-sm font-semibold text-brand-red py-2"
          >
            Keluar dari akun
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
