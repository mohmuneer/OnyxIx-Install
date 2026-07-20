'use client';

import { useState, useCallback } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { useGuideStore, type GuidePhase, type GuideStep, PHASE_COLORS } from '@/stores/guide-store';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import { EditorSidebar } from '@/components/ui/editor-sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Plus, Pencil, Trash2, GripVertical, RotateCcw, Check, X,
  Terminal, Database, Globe2, Server, Settings, MonitorCheck,
  FileText, Shield, Layers, Network, ChevronDown, ChevronUp,
  ArrowUp, ArrowDown as ArrowDownIcon,
} from 'lucide-react';

function StepEditor({ phase, isRTL }: { phase: GuidePhase; isRTL: boolean }) {
  const { addStep, updateStep, removeStep, reorderSteps } = useGuideStore();
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleAr, setEditTitleAr] = useState('');

  const handleAdd = useCallback(() => {
    if (!newTitleEn.trim()) return;
    addStep(phase.id, { title: newTitleEn.trim(), titleAr: newTitleAr.trim() || newTitleEn.trim() });
    setNewTitleEn('');
    setNewTitleAr('');
  }, [addStep, phase.id, newTitleEn, newTitleAr]);

  const handleUpdate = useCallback((stepId: string) => {
    updateStep(phase.id, stepId, { title: editTitleEn, titleAr: editTitleAr });
    setEditingId(null);
  }, [updateStep, phase.id, editTitleEn, editTitleAr]);

  const moveStep = useCallback((idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= phase.steps.length) return;
    const ids = phase.steps.map((s) => s.id);
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    reorderSteps(phase.id, ids);
  }, [reorderSteps, phase.id, phase.steps]);

  return (
    <div className="space-y-1.5 mt-2">
      {phase.steps.map((step, idx) => (
        <div
          key={step.id}
          className={cn(
            'rounded-lg border border-border/40 bg-background/50 overflow-hidden',
            editingId === step.id && 'border-primary/30 bg-primary/5'
          )}
        >
          {editingId === step.id ? (
            <div className="p-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground/60 text-xs w-5 shrink-0 text-end">{idx + 1}.</span>
                <Input value={editTitleEn} onChange={(e) => setEditTitleEn(e.target.value)} className="h-7 text-xs flex-1" placeholder="English" autoFocus />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground/60 text-xs w-5 shrink-0 text-end" />
                <Input value={editTitleAr} onChange={(e) => setEditTitleAr(e.target.value)} className="h-7 text-xs flex-1" placeholder="عربي" dir="rtl" />
              </div>
              <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => handleUpdate(step.id)}>
                  <Check className="h-3 w-3 me-1 text-green-500" /> Save
                </Button>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setEditingId(null)}>
                  <X className="h-3 w-3 me-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn('flex items-center gap-1.5 p-2', isRTL && 'flex-row-reverse')}>
              <div className={cn('flex flex-col gap-0.5 shrink-0', isRTL && 'flex-row')}>
                <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} className="disabled:opacity-20"><ArrowUp className="h-2.5 w-2.5 text-muted-foreground" /></button>
                <button onClick={() => moveStep(idx, 1)} disabled={idx === phase.steps.length - 1} className="disabled:opacity-20"><ArrowDownIcon className="h-2.5 w-2.5 text-muted-foreground" /></button>
              </div>
              <span className="text-muted-foreground/60 text-xs w-4 shrink-0 text-end">{idx + 1}.</span>
              <span className="flex-1 min-w-0 text-xs">{isRTL ? step.titleAr || step.title : step.title}</span>
              <div className={cn('flex items-center gap-0.5 shrink-0')}>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setEditingId(step.id); setEditTitleEn(step.title); setEditTitleAr(step.titleAr); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeStep(phase.id, step.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex items-center gap-1.5 mt-2">
        <Input value={newTitleEn} onChange={(e) => setNewTitleEn(e.target.value)} className="h-7 text-xs flex-1" placeholder="New step (EN)" onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
        <Input value={newTitleAr} onChange={(e) => setNewTitleAr(e.target.value)} className="h-7 text-xs flex-1" placeholder="خطوة جديدة (AR)" dir="rtl" onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
        <Button size="sm" variant="outline" className="h-7 px-2 shrink-0" onClick={handleAdd} disabled={!newTitleEn.trim()}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function PhaseEditor({ phase, isRTL, index, total }: { phase: GuidePhase; isRTL: boolean; index: number; total: number }) {
  const { updatePhase, removePhase, reorderPhases, phases } = useGuideStore();
  const [expanded, setExpanded] = useState(false);
  const [titleEn, setTitleEn] = useState(phase.title);
  const [titleAr, setTitleAr] = useState(phase.titleAr);
  const [descEn, setDescEn] = useState(phase.description);
  const [descAr, setDescAr] = useState(phase.descriptionAr);
  const [pdfHref, setPdfHref] = useState(phase.pdfHref);
  const [colorIdx, setColorIdx] = useState(() => PHASE_COLORS.findIndex((c) => c.color === phase.color));

  const handleSave = useCallback(() => {
    const c = PHASE_COLORS[colorIdx >= 0 ? colorIdx : 0];
    updatePhase(phase.id, { title: titleEn, titleAr, description: descEn, descriptionAr: descAr, pdfHref, color: c.color, bg: c.bg, border: c.border });
  }, [updatePhase, phase.id, titleEn, titleAr, descEn, descAr, pdfHref, colorIdx]);

  const movePhase = useCallback((dir: -1 | 1) => {
    const ids = phases.map((p) => p.id);
    const idx = ids.indexOf(phase.id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ids.length) return;
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    reorderPhases(ids);
  }, [reorderPhases, phases, phase.id]);

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
      <div className={cn('flex items-center gap-2 p-3', isRTL && 'flex-row-reverse')}>
        <div className={cn('flex flex-col gap-0.5 shrink-0', isRTL && 'flex-row')}>
          <button onClick={() => movePhase(-1)} disabled={index === 0} className="disabled:opacity-20"><ArrowUp className="h-3 w-3 text-muted-foreground" /></button>
          <button onClick={() => movePhase(1)} disabled={index === total - 1} className="disabled:opacity-20"><ArrowDownIcon className="h-3 w-3 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
            <Badge variant="outline" className="text-[10px] shrink-0">{phase.steps.length} steps</Badge>
            <span className="text-sm font-medium truncate">{isRTL ? phase.titleAr || phase.title : phase.title}</span>
          </div>
        </div>
        <div className={cn('flex items-center gap-1 shrink-0', isRTL && 'flex-row-reverse')}>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => removePhase(phase.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="p-3 pt-0 space-y-3">
          <Separator />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Title (EN)</label>
              <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="h-7 text-xs" onBlur={handleSave} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">العنوان (AR)</label>
              <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="h-7 text-xs" dir="rtl" onBlur={handleSave} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Description (EN)</label>
              <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} className="h-7 text-xs" onBlur={handleSave} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">الوصف (AR)</label>
              <Input value={descAr} onChange={(e) => setDescAr(e.target.value)} className="h-7 text-xs" dir="rtl" onBlur={handleSave} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">PDF Link</label>
              <Input value={pdfHref} onChange={(e) => setPdfHref(e.target.value)} className="h-7 text-xs" onBlur={handleSave} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Color</label>
              <div className="flex gap-1 mt-1">
                {PHASE_COLORS.map((c, i) => (
                  <button key={i} onClick={() => { setColorIdx(i); updatePhase(phase.id, { color: c.color, bg: c.bg, border: c.border }); }}
                    className={cn('w-5 h-5 rounded-full border-2 transition-all', colorIdx === i ? 'border-foreground scale-110' : 'border-transparent opacity-60 hover:opacity-100', c.bg, c.border)} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Steps ({phase.steps.length})</label>
            <StepEditor phase={phase} isRTL={isRTL} />
          </div>
        </div>
      )}
    </div>
  );
}

export function DeploymentGuideEditor({ isRTL }: { isRTL: boolean }) {
  const { t } = useLocale();
  const { addNotification } = useAppStore();
  const { phases, addPhase, resetToDefaults } = useGuideStore();
  const [open, setOpen] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');

  const handleAddPhase = useCallback(() => {
    if (!newTitleEn.trim()) return;
    addPhase({ title: newTitleEn.trim(), titleAr: newTitleAr.trim() || newTitleEn.trim() });
    setNewTitleEn('');
    setNewTitleAr('');
  }, [addPhase, newTitleEn, newTitleAr]);

  const handleReset = useCallback(() => {
    resetToDefaults();
    addNotification({ type: 'info', title: 'Guide reset to defaults', message: '' });
  }, [resetToDefaults, addNotification]);

  return (
    <>
      <Button variant="outline" size="sm" className="h-8" onClick={() => setOpen(true)}>
        <Pencil className={cn('h-3.5 w-3.5', isRTL ? 'ms-1' : 'me-1')} /> {t('common.edit')}
      </Button>

      <EditorSidebar open={open} onClose={() => setOpen(false)} title={`${t('guide.title')} — Editor`} width="w-[480px]">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground">Add New Phase</label>
            <div className="flex items-center gap-1.5">
              <Input value={newTitleEn} onChange={(e) => setNewTitleEn(e.target.value)} className="h-8 text-xs flex-1" placeholder="Phase (EN)" onKeyDown={(e) => e.key === 'Enter' && handleAddPhase()} />
              <Input value={newTitleAr} onChange={(e) => setNewTitleAr(e.target.value)} className="h-8 text-xs flex-1" placeholder="مرحلة (AR)" dir="rtl" onKeyDown={(e) => e.key === 'Enter' && handleAddPhase()} />
              <Button size="sm" onClick={handleAddPhase} disabled={!newTitleEn.trim()} className="h-8 px-2 shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            {phases.map((phase, idx) => (
              <PhaseEditor key={phase.id} phase={phase} isRTL={isRTL} index={idx} total={phases.length} />
            ))}
          </div>
          <Separator />
          <Button variant="outline" size="sm" onClick={handleReset} className="w-full h-8">
            <RotateCcw className="h-3.5 w-3.5 me-1" /> Reset to Defaults
          </Button>
        </div>
      </EditorSidebar>
    </>
  );
}
