import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AccountsPage } from './pages/AccountsPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { PrivateLayout } from './components/PrivateLayout';

import type { JSX } from 'react';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />

        <Route path="/budgets" element={<BudgetsPage />} />
        <Route
          path="/goals"
          element={<ComingSoonPage title="Target Tabungan" />}
        />
        <Route path="/reports" element={<ComingSoonPage title="Laporan" />} />
        <Route
          path="/scan-receipt"
          element={<ComingSoonPage title="Scan Struk" />}
        />
        <Route
          path="/settings"
          element={<ComingSoonPage title="Pengaturan" />}
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
