'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Globe,
  Shield,
  Download,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { useDashboardStore } from '@/stores/dashboard-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DashboardSection, RequirementCategory } from '@/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Database,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Globe,
  Shield,
  Download,
};

function SectionIcon({ type, className, style }: { type: string; className?: string; style?: React.CSSProperties }) {
  const IconComponent = ICON_MAP[type] || Server;
  return <IconComponent className={className} style={style} />;
}

function HwIcon({ type, className }: { type: string; className?: string }) {
  const IconComponent = ICON_MAP[type] || Cpu;
  return <IconComponent className={className} />;
}

interface Props {
  onEdit: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function SystemInfoCards({ onEdit, onExportPDF, onExportExcel }: Props) {
  const { isRTL } = useLocale();
  const { data, init } = useDashboardStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="space-y-4">
      {/* Server Specifications */}
      <div className="grid gap-4 lg:grid-cols-2">
        {data.sections.map((section, si) => (
          <SectionCard key={section.id} section={section} si={si} isRTL={isRTL} />
        ))}
      </div>

      {/* Onyx IX Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl bg-[#111827] border border-[#FF9800]/20 overflow-hidden"
      >
        <div className={cn('flex items-center justify-between px-5 py-4 border-b border-[#FF9800]/20', isRTL && 'flex-row-reverse')}>
          <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
            <div className="p-2.5 rounded-xl bg-[#FF9800]/10">
              <Download className="h-5 w-5 text-[#FF9800]" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {isRTL ? 'متطلبات تركيب نظام Onyx IX' : 'ONYX IX Installation Requirements'}
            </h3>
          </div>
          <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportPDF}
              className="gap-1 text-[10px] text-[#38BDF8] hover:text-[#38BDF8] hover:bg-[#38BDF8]/10 rounded-xl"
            >
              <FileText className="h-3 w-3" />
              PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportExcel}
              className="gap-1 text-[10px] text-[#18B13A] hover:text-[#18B13A] hover:bg-[#18B13A]/10 rounded-xl"
            >
              <FileSpreadsheet className="h-3 w-3" />
              Excel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="gap-1 text-[10px] text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-xl"
            >
              {isRTL ? 'تعديل' : 'Edit'}
            </Button>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.requirements.map((req, ri) => (
              <RequirementCard key={ri} req={req} ri={ri} isRTL={isRTL} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SectionCard({ section, si, isRTL }: { section: DashboardSection; si: number; isRTL: boolean }) {
  return (
    <motion.div
      key={section.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * si }}
      className="rounded-2xl bg-[#111827] border overflow-hidden"
      style={{ borderColor: `${section.color}33` }}
    >
      {/* Header */}
      <div className={cn('flex items-center gap-3 px-5 py-4 border-b', isRTL && 'flex-row-reverse')} style={{ borderColor: `${section.color}33` }}>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${section.color}1a` }}>
          <SectionIcon type={section.iconType} className="h-5 w-5" style={{ color: section.color }} />
        </div>
        <h3 className="text-sm font-bold text-white">{section.title[isRTL ? 'ar' : 'en']}</h3>
      </div>

      <div className="p-5 space-y-5">
        {section.hw.length > 0 && (
          <div>
            <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {isRTL ? 'مواصفات العتاد' : 'H/W SPECIFICATION'}
              </span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <div className="space-y-1">
              {section.hw.map((item, hi) => (
                <motion.div
                  key={hi}
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * hi + 0.2 * si }}
                  className={cn(
                    'flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  <div className="p-1.5 rounded-lg bg-white/[0.04]">
                    <HwIcon type={item.iconType} className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-500 w-20 shrink-0">{item.label[isRTL ? 'ar' : 'en']}</span>
                  <span className="text-xs font-medium font-mono text-slate-300">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {section.sw.length > 0 && (
          <div>
            <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {isRTL ? 'مواصفات البرمجيات' : 'S/W SPECIFICATION'}
              </span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <div className="space-y-1">
              {section.sw.map((item, si2) => (
                <motion.div
                  key={si2}
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * si2 + 0.3 }}
                  className={cn(
                    'flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  <div className="p-1.5 rounded-lg bg-white/[0.04]">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-500 w-28 shrink-0">{item.label[isRTL ? 'ar' : 'en']}</span>
                  <span className="text-xs font-medium text-slate-300">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RequirementCard({ req, ri, isRTL }: { req: RequirementCategory; ri: number; isRTL: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * ri + 0.4 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
    >
      <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
        <Shield className="h-3.5 w-3.5 text-[#FF9800]" />
        <span className="text-xs font-semibold text-white">{req.category[isRTL ? 'ar' : 'en']}</span>
      </div>
      <div className="space-y-1.5">
        {req.items.map((item, ii) => (
          <div
            key={ii}
            className={cn(
              'flex items-center gap-2 py-1.5 px-2.5 rounded-lg hover:bg-white/[0.03] transition-colors',
              isRTL && 'flex-row-reverse'
            )}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800]/60 shrink-0" />
            <span className="text-[11px] text-slate-400">{item[isRTL ? 'ar' : 'en']}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
