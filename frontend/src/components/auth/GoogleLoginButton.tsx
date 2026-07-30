import { useEffect, useRef } from "react";
import { GoogleCredentialResponse } from "../../types/google";
import type { JSX } from 'react';

interface GoogleLoginButtonProps {
  onCredential: (credential: string) => void;
}

const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export function GoogleLoginButton({ onCredential }: GoogleLoginButtonProps): JSX.Element {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.google || !buttonRef.current || !GOOGLE_CLIENT_ID) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: GoogleCredentialResponse) => {
        onCredential(response.credential);
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: 320,
      text: "continue_with",
    });
  }, [onCredential]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-xs text-slate-400 text-center">
        Login Google belum dikonfigurasi (VITE_GOOGLE_CLIENT_ID kosong)
      </p>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
}
