import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileTopbar } from './MobileTopbar';
import type { JSX } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex bg-[#EFEAFB] dark:bg-dark-background">
      <Sidebar />

      <main className="flex-1 p-4 min-[1281px]:p-8 overflow-x-hidden">
        <MobileTopbar />

        <Header />

        {children}
      </main>
    </div>
  );
}
