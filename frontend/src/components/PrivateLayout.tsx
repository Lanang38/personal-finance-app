import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AccountProvider } from "../context/AccountContext";
import type { JSX } from 'react';

export function PrivateLayout(): JSX.Element {
  return (
    <ProtectedRoute>
      <AccountProvider>
        <Outlet />
      </AccountProvider>
    </ProtectedRoute>
  );
}
