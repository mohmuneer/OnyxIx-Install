'use client';

import { BrandingSettings } from '@/components/branding/branding-settings';
import { useLocale } from '@/hooks/use-locale';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function BrandingPage() {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.role);
  const router = useRouter();

  useEffect(() => {
    if (role !== null && role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [role, router]);

  if (role === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (role !== 'admin') return null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">{t('branding.title')}</h1>
        <p className="text-slate-500">{t('branding.subtitle')}</p>
      </div>
      <BrandingSettings />
    </div>
  );
}
