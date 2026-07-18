'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { BrandingSettings } from '@/components/branding/branding-settings';
import { useLocale } from '@/hooks/use-locale';

export default function BrandingPage() {
  const { t } = useLocale();
  return (
    <AppLayout>
      <div className="us-page-bg min-h-screen">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('branding.title')}</h1>
          <p className="text-slate-500">{t('branding.subtitle')}</p>
        </div>
        <BrandingSettings />
      </div>
      </div>
    </AppLayout>
  );
}
