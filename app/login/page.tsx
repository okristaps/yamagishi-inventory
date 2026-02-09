'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/api/auth.api';
import { Alert } from '@/components/ui/Alert';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileTextIcon } from '@radix-ui/react-icons';

const PIN_LENGTH = 4;

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [pin, setPin] = useState('');

  const loginMutation = useMutation({
    mutationFn: (pinCode: string) => AuthService.login(pinCode),
    onSuccess: (result) => {
      if (result.success) {
        router.replace('/');
      } else {
        loginMutation.reset();
        setPin('');
      }
    },
    onError: () => {
      setPin('');
    },
  });

  const handleNumpadPress = (value: string) => {
    if (loginMutation.isPending) return;

    if (value === 'clear') {
      setPin('');
      loginMutation.reset();
      return;
    }

    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + value;
    setPin(newPin);

    if (newPin.length === PIN_LENGTH) {
      loginMutation.mutate(newPin);
    }
  };

  const error = loginMutation.isError
    ? t('login.loginFailed')
    : loginMutation.data && !loginMutation.data.success
      ? loginMutation.data.error || t('login.incorrectPin')
      : null;

  const NumpadButton = ({ value, label }: { value: string; label?: string }) => (
    <button
      onClick={() => handleNumpadPress(value)}
      disabled={loginMutation.isPending}
      className={`
        w-[72px] h-[72px] rounded-full text-2xl font-medium
        flex items-center justify-center
        transition-all duration-150
        ${value === 'clear'
          ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-normal'
          : 'bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95'
        }
        ${loginMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {label || value}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-xs">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <FileTextIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('login.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('login.subtitle')}
          </p>
        </div>

        {error && (
          <Alert severity="error" className="mb-6" onClose={() => loginMutation.reset()}>
            {error}
          </Alert>
        )}

        <div className="flex justify-center gap-4 mb-8">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`
                w-3.5 h-3.5 rounded-full transition-all duration-200
                ${loginMutation.isPending && pin.length === PIN_LENGTH
                  ? 'bg-blue-500 animate-pulse'
                  : pin.length > i
                    ? 'bg-blue-500 scale-110'
                    : 'bg-gray-300 dark:bg-gray-600'
                }
              `}
            />
          ))}
        </div>

        {loginMutation.isPending ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t('login.signingIn')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 place-items-center">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <NumpadButton key={num} value={num} />
            ))}
            <div className="w-[72px] h-[72px]" />
            <NumpadButton value="0" />
            <NumpadButton value="clear" label={t('login.clear')} />
          </div>
        )}
      </div>
    </div>
  );
}
