'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/api/auth.api';

const IDLE_TIMEOUT = 30000;
const IDLE_EVENTS = ['click', 'touchstart', 'scroll', 'keypress', 'mousemove'];

interface UseIdleMonitorOptions {
  enabled?: boolean;
  timeout?: number;
  onIdle?: () => void;
}

export function useIdleMonitor(options: UseIdleMonitorOptions = {}) {
  const { enabled = true, timeout = IDLE_TIMEOUT, onIdle } = options;
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isIdleRef = useRef(false);

  const handleIdle = useCallback(async () => {
    if (isIdleRef.current) return;
    isIdleRef.current = true;

    console.log('Idle timeout reached - logging out');

    if (onIdle) {
      onIdle();
    }

    await AuthService.logout();
    router.replace('/login');
  }, [onIdle, router]);

  const resetTimer = useCallback(() => {
    if (!enabled || isIdleRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(handleIdle, timeout);
  }, [enabled, timeout, handleIdle]);

  useEffect(() => {
    if (!enabled) return;

    isIdleRef.current = false;
    resetTimer();

    IDLE_EVENTS.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      IDLE_EVENTS.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [enabled, resetTimer]);

  return {
    resetTimer,
    isIdle: isIdleRef.current,
  };
}
