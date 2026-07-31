export interface AuthUser {
  userId: string;
  email: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: "local" | "google";
}
