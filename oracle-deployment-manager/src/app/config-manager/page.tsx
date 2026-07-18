'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ConfigManager } from '@/components/config-manager/config-manager';
import { useLocale } from '@/hooks/use-locale';

export default function ConfigManagerPage() {
  const { t } = useLocale();
  return (
    <AppLayout>
      <div className="us-page-bg min-h-screen">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('configManager.title')}</h1>
          <p className="text-slate-500">{t('configManager.subtitle')}</p>
        </div>
        <ConfigManager />
      </div>
      </div>
    </AppLayout>
  );
}
