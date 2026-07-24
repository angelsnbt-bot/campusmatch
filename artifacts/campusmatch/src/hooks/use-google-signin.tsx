import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean }) => void;
          renderButton: (parent: HTMLElement, config: { theme?: string; size?: string; width?: number; text?: string; shape?: string }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL || '';

async function googleAuthApi(credential: string): Promise<{ user: any; token: string; refreshToken?: string }> {
  const res = await fetch(`${API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Google sign-in failed' }));
    throw new Error(err.error || 'Google sign-in failed');
  }
  return res.json();
}

export function useGoogleSignIn() {
  const { setToken } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const initRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (credential: string) => googleAuthApi(credential),
    onSuccess: (data) => {
      setToken(data.token);
      toast({ title: 'Welcome!' });
      setLocation('/dashboard');
    },
    onError: (err: any) => {
      toast({ title: 'Google sign-in failed', description: err?.message || 'Could not sign in with Google.', variant: 'destructive' as any });
    },
  });

  const handleCredential = useCallback((response: { credential: string }) => {
    mutation.mutate(response.credential);
  }, [mutation]);

  useEffect(() => {
    if (initRef.current) return;
    const check = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(check);
        initRef.current = true;
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: handleCredential,
        });
        const container = document.getElementById('google-signin-btn');
        if (container && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: container.offsetWidth || 400,
            text: 'continue_with',
            shape: 'rectangular',
          });
        }
      }
    }, 100);
    return () => clearInterval(check);
  }, [handleCredential]);

  return { isPending: mutation.isPending, isAvailable: !!import.meta.env.VITE_GOOGLE_CLIENT_ID };
}
