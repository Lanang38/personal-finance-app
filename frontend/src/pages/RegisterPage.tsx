import { FormEvent, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLoginButton } from "../components/auth/GoogleLoginButton";
import { getErrorMessage } from "../api/client";
import type { JSX } from 'react';

export function RegisterPage(): JSX.Element {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError("");
      try {
        await loginWithGoogle(credential);
        navigate("/dashboard");
      } catch (err) {
        setError(getErrorMessage(err));
      }
    },
    [loginWithGoogle, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFEAFB] dark:bg-dark-background px-4">
      <div className="w-full max-w-md bg-white dark:bg-dark-component rounded-3xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-brand-lime font-bold">
            F
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Finance
          </span>
        </div>

        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 text-center">
          Buat Akun
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center mb-6">
          Mulai kelola keuangan Anda dengan mudah
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none"
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-slate-100 dark:bg-dark-background rounded-xl px-4 py-2.5 outline-none"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-purple dark:bg-brand-blue text-white font-semibold py-3 rounded-xl disabled:opacity-60"
          >
            {isSubmitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-slate-100 dark:bg-slate-600 flex-1" />
          <span className="text-xs text-slate-400 dark:text-slate-500">atau</span>
          <div className="h-px bg-slate-100 dark:bg-slate-600 flex-1" />
        </div>

        <GoogleLoginButton onCredential={handleGoogleCredential} />

        <p className="text-sm text-slate-500 text-center mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-brand-purple dark:text-brand-blue font-semibold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
