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
import {
  SettingsNav,
  SettingsTabItem,
} from '../components/settings/SettingsNav';
import { ProfileTab } from '../components/settings/tabs/profil/ProfileTab';
import { AppearanceTab } from '../components/settings/tabs/appearance/AppearanceTab';
import { NotificationsTab } from '../components/settings/tabs/notification/NotificationsTab';
import { PreferencesTab } from '../components/settings/tabs/preferences/PreferencesTab';
import { DataExportTab } from '../components/settings/tabs/dataexport/DataExportTab';
import { AboutTab } from '../components/settings/tabs/AboutTab';
import { DeleteAccountTab } from '../components/settings/tabs/deleteaccount/DeleteAccountTab';
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

const TAB_CONTENT: Record<SettingsTabId, JSX.Element> = {
  profile: <ProfileTab />,
  appearance: <AppearanceTab />,
  notifications: <NotificationsTab />,
  preferences: <PreferencesTab />,
  data: <DataExportTab />,
  about: <AboutTab />,
  delete: <DeleteAccountTab />,
};

export function SettingsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');

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

        <div className="lg:col-span-3 space-y-6">{TAB_CONTENT[activeTab]}</div>
      </div>
    </DashboardLayout>
  );
}
