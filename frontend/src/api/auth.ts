import { apiClient } from "./client";
import { User } from "../types";

export interface AuthResponse {
  token: string;
  user: User;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function googleLoginRequest(credential: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/google", { credential });
  return data;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data.user;
}
