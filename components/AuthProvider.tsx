'use client';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService, UserData } from '@/api/auth.api';
import { Layout } from '@/components/Layout';
import { AuthState } from '@/types/auth';
import { useIdleMonitor } from '@/hooks';
import { toast } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';

const UserContext = createContext<UserData | null>(null);

export function useUser() {
  return useContext(UserContext);
}

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
  const [user, setUser] = useState<UserData | null>(null);
  const isCheckingRef = useRef(false);
  const { t } = useTranslation();

  useIdleMonitor({
    enabled: authState === AuthState.AUTHENTICATED,
    onIdle: () => {
      toast.warning(t('common.sessionExpired'), t('common.loggedOutInactivity'));
    },
  });

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
          setUser(null);
          return;
        }

        if (loggedIn && pathname === '/login') {
          router.replace('/');
          return;
        }

        if (loggedIn) {
          const userData = await AuthService.getUserData();
          setUser(userData);
        }

        setAuthState(loggedIn ? AuthState.AUTHENTICATED : AuthState.UNAUTHENTICATED);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(AuthState.UNAUTHENTICATED);
        setUser(null);
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

  return (
    <UserContext.Provider value={user}>
      <Layout>{children}</Layout>
    </UserContext.Provider>
  );
}
