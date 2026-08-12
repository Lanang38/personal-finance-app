import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User } from '../types';
import {
  fetchProfile,
  loginRequest,
  registerRequest,
  googleLoginRequest,
} from '../api/auth';
import type { JSX } from 'react';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  retryLoadProfile: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'finance_token';
const PROFILE_TIMEOUT_MS = 10000;

// Bungkus promise dengan batas waktu, supaya kalau jaringan nge-hang
// (bukan langsung gagal, cuma lambat/tidak pernah respon), kita tidak
// nunggu tanpa batas — setelah PROFILE_TIMEOUT_MS, dianggap gagal.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error('Waktu permintaan habis, periksa koneksi internet kamu'),
      );
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Cek apakah error ini jelas-jelas soal sesi tidak valid (401/403) —
// hanya dalam kasus ini token dihapus & user di-logout paksa. Kalau
// bukan (mis. jaringan mati/timeout), token tetap disimpan supaya user
// tidak perlu login ulang cuma karena sinyal lagi jelek.
function isAuthError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const maybeResponse = (err as { response?: { status?: number } }).response;
  return maybeResponse?.status === 401 || maybeResponse?.status === 403;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const profile = await withTimeout(fetchProfile(), PROFILE_TIMEOUT_MS);
      setUser(profile);
    } catch (err) {
      if (isAuthError(err)) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } else {
        setAuthError(
          err instanceof Error
            ? err.message
            : 'Gagal memuat profil, periksa koneksi internet kamu',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const retryLoadProfile = useCallback(() => {
    void loadProfile();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedInUser } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token, user: newUser } = await registerRequest(
        name,
        email,
        password,
      );
      localStorage.setItem(TOKEN_KEY, token);
      setUser(newUser);
    },
    [],
  );

  const loginWithGoogle = useCallback(async (credential: string) => {
    const { token, user: googleUser } = await googleLoginRequest(credential);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(googleUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setAuthError(null);
  }, []);

  const updateUser = useCallback((next: User) => {
    setUser(next);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    authError,
    retryLoadProfile,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
}
