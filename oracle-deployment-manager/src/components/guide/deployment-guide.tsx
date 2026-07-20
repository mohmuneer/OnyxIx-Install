'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { useAppStore } from '@/stores/app-store';
import { useGuideStore, type GuidePhase } from '@/stores/guide-store';
import { DeploymentGuideEditor } from './guide-editor';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp,
  RotateCcw, ArrowDown,
  Terminal, Database, Globe2, Server, Settings, MonitorCheck,
  FileText, Shield, Layers, Network,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Terminal, Database, Globe2, Server, Settings, MonitorCheck,
  FileText, Shield, Layers, Network,
};

const STORAGE_KEY = 'ix-deployment-checklist';

function loadChecked(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveChecked(checked: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
}

export function DeploymentGuide() {
  const { t, isRTL } = useLocale();
  const { addNotification } = useAppStore();
  const { phases } = useGuideStore();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  useEffect(() => { setChecked(loadChecked()); }, []);

  const toggleStep = useCallback((key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveChecked(next);
      return next;
    });
  }, []);

  const togglePhase = useCallback((phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }, []);

  const expandAll = useCallback(() => {
    const all: Record<string, boolean> = {};
    phases.forEach((p) => { all[p.id] = true; });
    setExpandedPhases(all);
  }, [phases]);

  const collapseAll = useCallback(() => {
    setExpandedPhases({});
  }, []);

  const resetChecklist = useCallback(() => {
    setChecked({});
    saveChecked({});
    addNotification({ type: 'info', title: t('guide.resetChecklist'), message: '' });
  }, [addNotification, t]);

  const totalSteps = useMemo(() => phases.reduce((sum, p) => sum + p.steps.length, 0), [phases]);
  const doneSteps = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
  const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-start">{t('guide.title')}</h1>
          <p className="text-muted-foreground text-start text-sm">{t('guide.subtitle')}</p>
        </div>
        <div className={cn('flex items-center gap-2 flex-wrap', isRTL && 'flex-row-reverse')}>
          <DeploymentGuideEditor isRTL={isRTL} />
          <Button variant="outline" size="sm" onClick={expandAll} className="h-8">
            <ChevronDown className={cn('h-3.5 w-3.5', isRTL ? 'ms-1' : 'me-1')} /> All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} className="h-8">
            <ChevronUp className={cn('h-3.5 w-3.5', isRTL ? 'ms-1' : 'me-1')} /> All
          </Button>
          <Button variant="outline" size="sm" onClick={resetChecklist} className="h-8">
            <RotateCcw className={cn('h-3.5 w-3.5', isRTL ? 'ms-1' : 'me-1')} /> {t('guide.resetChecklist')}
          </Button>
        </div>
      </div>

      {/* Overall progress */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className={cn('flex items-center justify-between mb-2', isRTL && 'flex-row-reverse')}>
            <span className="text-sm font-medium">{t('guide.progress')}</span>
            <span className="text-sm text-muted-foreground">{t('guide.completedSteps', { done: doneSteps, total: totalSteps })}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', progress === 100 ? 'bg-green-500' : 'bg-primary')}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-end">{progress}%</p>
        </CardContent>
      </Card>

      {/* Phases */}
      <div className="space-y-3">
        {phases.map((phase, idx) => {
          const IconComp = ICON_MAP[phase.icon] || Settings;
          const isExpanded = expandedPhases[phase.id] ?? false;
          const phaseDone = phase.steps.filter((k) => checked[k.id]).length;
          const phaseTotal = phase.steps.length;
          const phaseComplete = phaseDone === phaseTotal;

          return (
            <div key={phase.id}>
              <Card className={cn('border transition-all', phase.border, phaseComplete && 'bg-green-500/5')}>
                {/* Phase header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className={cn('w-full flex items-center gap-3 p-4 text-start hover:bg-accent/30 transition-colors rounded-lg', isRTL && 'flex-row-reverse')}
                >
                  <div className={cn('p-2 rounded-lg', phase.bg)}>
                    <IconComp className={cn('h-5 w-5', phase.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                      <h3 className="text-sm font-semibold">{isRTL ? phase.titleAr || phase.title : phase.title}</h3>
                      {phaseComplete && (
                        <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/50">
                          <CheckCircle2 className="h-3 w-3 me-0.5" /> OK
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{isRTL ? phase.descriptionAr || phase.description : phase.description}</p>
                  </div>
                  <div className={cn('flex items-center gap-2 shrink-0', isRTL && 'flex-row-reverse')}>
                    <Badge variant="secondary" className="text-[10px]">{phaseDone}/{phaseTotal}</Badge>
                    {phase.pdfHref && (
                      <a
                        href={phase.pdfHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors"
                        title={t('guide.viewGuide')}
                      >
                        <BookOpen className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {/* Steps */}
                {isExpanded && (
                  <CardContent className="pt-0 pb-4">
                    <Separator className="mb-3" />
                    <div className="space-y-1">
                      {phase.steps.map((step, stepIdx) => {
                        const isChecked = !!checked[step.id];
                        return (
                          <button
                            key={step.id}
                            onClick={() => toggleStep(step.id)}
                            className={cn(
                              'w-full flex items-center gap-3 p-2.5 rounded-md text-start transition-colors',
                              isChecked ? 'bg-green-500/5 hover:bg-green-500/10' : 'hover:bg-accent/30',
                              isRTL && 'flex-row-reverse'
                            )}
                          >
                            <div className="shrink-0">
                              {isChecked ? (
                                <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                              ) : (
                                <Circle className="h-4.5 w-4.5 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn('text-sm', isChecked && 'text-green-600 dark:text-green-400 line-through opacity-80')}>
                                <span className={cn('text-muted-foreground/60 text-xs me-2', isRTL && 'ms-2 me-0')}>{stepIdx + 1}.</span>
                                {isRTL ? step.titleAr || step.title : step.title}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>

              {idx < phases.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
