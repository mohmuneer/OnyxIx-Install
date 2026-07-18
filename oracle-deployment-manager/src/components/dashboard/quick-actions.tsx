'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Rocket,
  FolderOpen,
  Settings2,
  RotateCcw,
  UserCircle2,
  Code2,
  Package,
  FileText,
  Layers,
} from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

const ACTIONS = [
  { href: '/sw-deploy', labelKey: 'nav.swDeploy', icon: Package, color: '#FF9800', bg: 'bg-[#FF9800]/10' },
  { href: '/deployment', labelKey: 'nav.deployment', icon: Rocket, color: '#18B13A', bg: 'bg-[#18B13A]/10' },
  { href: '/architecture', labelKey: 'nav.architecture', icon: Layers, color: '#38BDF8', bg: 'bg-[#38BDF8]/10' },
  { href: '/file-manager', labelKey: 'nav.fileManager', icon: FolderOpen, color: '#22C55E', bg: 'bg-[#22C55E]/10' },
  { href: '/config-manager', labelKey: 'nav.configManager', icon: Settings2, color: '#3A3A96', bg: 'bg-[#3A3A96]/10' },
  { href: '/editor', labelKey: 'nav.smartEditor', icon: Code2, color: '#A78BFA', bg: 'bg-[#A78BFA]/10' },
  { href: '/profiles', labelKey: 'nav.profiles', icon: UserCircle2, color: '#F472B6', bg: 'bg-[#F472B6]/10' },
  { href: '/templates', labelKey: 'nav.templates', icon: FileText, color: '#38BDF8', bg: 'bg-[#38BDF8]/10' },
  { href: '/rollback', labelKey: 'nav.rollback', icon: RotateCcw, color: '#EF4444', bg: 'bg-[#EF4444]/10' },
];

export function QuickActions() {
  const { t, isRTL } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-[#111827] border border-white/[0.06] overflow-hidden"
    >
      <div className={cn('flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]', isRTL && 'flex-row-reverse')}>
        <Rocket className="h-4 w-4 text-[#18B13A]" />
        <span className="text-sm font-semibold text-white">{t('dashboard.quickActions')}</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.03 * i }}
              >
                <Link href={action.href}>
                  <div className={cn(
                    'group flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl border border-white/[0.04] bg-white/[0.02]',
                    'hover:bg-white/[0.05] hover:border-white/[0.08]',
                    'transition-all duration-200 cursor-pointer text-center'
                  )}>
                    <div className={cn(
                      'p-2.5 rounded-xl transition-all duration-200 group-hover:scale-110',
                      action.bg
                    )}>
                      <Icon className="h-5 w-5" style={{ color: action.color }} />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors leading-tight">
                      {t(action.labelKey)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}