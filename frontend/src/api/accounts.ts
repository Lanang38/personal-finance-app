import { apiClient } from "./client";
import { Account, AccountType } from "../types";

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await apiClient.get<{ accounts: Account[] }>("/accounts");
  return data.accounts;
}

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  currency?: string;
  initialBalance?: number;
}

export async function createAccountRequest(payload: CreateAccountPayload): Promise<Account> {
  const { data } = await apiClient.post<{ account: Account }>("/accounts", payload);
  return data.account;
}

export async function deleteAccountRequest(id: string): Promise<void> {
  await apiClient.delete(`/accounts/${id}`);
}
