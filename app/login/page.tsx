'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/api/auth.api';
import { toast } from '@/components/ui/Toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import { CircularProgress } from '@/components/ui';

const PIN_LENGTH = 4;

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [pin, setPin] = useState('');

  const loginMutation = useMutation({
    mutationFn: (pinCode: string) => AuthService.login(pinCode),
    onSuccess: result => {
      if (result.success) {
        router.replace('/');
      } else {
        toast.error(t('login.incorrectPin'));
        setPin('');
      }
    },
    onError: () => {
      toast.error(t('login.incorrectPin'));
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

  const NumpadButton = ({
    value,
    label,
  }: {
    value: string;
    label?: string;
  }) => (
    <button
      onClick={() => handleNumpadPress(value)}
      disabled={loginMutation.isPending}
      className={`
        w-[72px] h-[72px] landscape:w-[56px] landscape:h-[56px] rounded-full text-2xl landscape:text-xl font-medium
        flex items-center justify-center
        transition-all duration-150
        ${
          value === 'clear'
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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6 landscape:p-4 landscape:overflow-y-auto relative">
      <div className="absolute bottom-4 left-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-xs landscape:max-w-none landscape:flex landscape:items-center landscape:justify-center landscape:gap-8">
        <div className="text-center mb-6 landscape:mb-0 landscape:flex-shrink-0">
          <div className="w-40 h-40 landscape:w-24 landscape:h-24 mx-auto mb-4 landscape:mb-2 relative">
            <Image
              src="/logo.png"
              alt="Yamagishi"
              fill
              className="rounded-2xl object-contain"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 landscape:hidden">
            {t('login.subtitle')}
          </p>
        </div>

        <div className="landscape:flex landscape:flex-col landscape:items-center">
          <div className="flex justify-center gap-4 landscape:gap-3 mb-8 landscape:mb-4">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <div
                key={i}
                className={`
                  w-3.5 h-3.5 landscape:w-3 landscape:h-3 rounded-full transition-all duration-200
                  ${
                    loginMutation.isPending && pin.length === PIN_LENGTH
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
            <div className="flex flex-col items-center py-16 landscape:py-4">
              <CircularProgress
                variant="indeterminate"
                size={40}
                thickness={4}
              />
              <p className="mt-4 landscape:mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('login.signingIn')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 landscape:gap-2 place-items-center">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <NumpadButton key={num} value={num} />
              ))}
              <div className="w-[72px] h-[72px] landscape:w-[56px] landscape:h-[56px]" />
              <NumpadButton value="0" />
              <NumpadButton value="clear" label={t('login.clear')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
