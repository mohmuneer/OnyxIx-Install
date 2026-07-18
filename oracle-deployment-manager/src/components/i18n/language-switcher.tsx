'use client';

import { useLocale } from '@/hooks/use-locale';
import { LOCALES, type Locale } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{LOCALES[locale].flag} {LOCALES[locale].nativeName}</span>
        <span className="sm:hidden">{LOCALES[locale].flag}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-[#1E293B] border-white/[0.06] rounded-xl shadow-2xl">
        {(Object.keys(LOCALES) as Locale[]).map((code) => {
          const info = LOCALES[code];
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setLocale(code)}
              className={cn(
                'flex items-center gap-2 text-sm text-slate-300 rounded-lg',
                locale === code && 'bg-[#18B13A]/10 text-[#4ADE80]'
              )}
            >
              <span className="text-base">{info.flag}</span>
              <span className="flex-1">{info.nativeName}</span>
              {locale === code && <Check className="h-4 w-4 text-[#18B13A]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}