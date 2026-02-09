'use client';

import { useTranslation } from 'react-i18next';
import { Page } from '@/components/ui';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <Page>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t('dashboard.title')}
      </h1>
    </Page>
  );
}