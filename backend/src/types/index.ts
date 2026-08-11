export interface AuthUser {
  userId: string;
  email: string;
}

export interface PublicUser {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  avatarUrl?: string;
  authProvider: 'local' | 'google';
}