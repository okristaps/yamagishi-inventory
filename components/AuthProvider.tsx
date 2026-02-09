'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '@/api/auth.api';
import { Layout } from '@/components/Layout';
import { AuthState } from '@/types/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/login'];

function isPublicRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>(AuthState.CHECKING);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (isCheckingRef.current) return;

    const checkAuth = async () => {
      isCheckingRef.current = true;
      const isPublic = isPublicRoute(pathname);

      try {
        const loggedIn = await AuthService.isLoggedIn();

        if (!loggedIn && !isPublic) {
          router.replace('/login');
          setAuthState(AuthState.UNAUTHENTICATED);
          return;
        }

        if (loggedIn && pathname === '/login') {
          router.replace('/');
          return;
        }

        setAuthState(loggedIn ? AuthState.AUTHENTICATED : AuthState.UNAUTHENTICATED);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(AuthState.UNAUTHENTICATED);
        if (!isPublic) {
          router.replace('/login');
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  if (authState === AuthState.CHECKING || authState === AuthState.UNAUTHENTICATED) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}
