'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { EditorSidebar } from '@/components/ui/editor-sidebar';
import {
  Settings2,
  Plus,
  Trash2,
  RotateCcw,
  Pencil,
  Server,
  Globe,
  Database,
  BookOpen,
  GitBranch,
  Link2,
  X,
  ChevronDown,
  ChevronUp,
  Save,
} from 'lucide-react';
import { useArchitectureStore } from '@/stores/architecture-store';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import type { ArchitectureTool, JourneyStep, GuideCard } from '@/lib/architecture-data';
import type { Connection } from '@/stores/architecture-store';

const ICON_OPTIONS = ['Globe', 'Coffee', 'MonitorCheck', 'Server', 'FileSpreadsheet', 'Globe2', 'FileBarChart', 'Terminal', 'Lock', 'Database'];
const TIER_OPTIONS = ['client', 'application', 'database'] as const;
const SERVICE_KEY_OPTIONS = ['weblogicStatus', 'databaseStatus', 'listenerStatus'] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ArchitectureDataEditor({ open, onClose }: Props) {
  const { isRTL } = useLocale();
  const { data, updateTools, addTool, removeTool, addJourneyStep, updateJourneyStep, removeJourneyStep, addGuide, removeGuide, updateConnections, resetDefaults } = useArchitectureStore();
  const [activeTab, setActiveTab] = useState<'tools' | 'journey' | 'guides' | 'connections'>('tools');
  const [expandedTier, setExpandedTier] = useState<string | null>('client');

  const tabs = [
    { id: 'tools' as const, label: isRTL ? 'المكونات' : 'Components', icon: Server },
    { id: 'journey' as const, label: isRTL ? 'رحلة الطلب' : 'Journey', icon: GitBranch },
    { id: 'guides' as const, label: isRTL ? 'الأدلة' : 'Guides', icon: BookOpen },
    { id: 'connections' as const, label: isRTL ? 'الربط' : 'Connections', icon: Link2 },
  ];

  return (
    <EditorSidebar open={open} onClose={onClose} title={isRTL ? 'تعديل المعمارية' : 'Edit Architecture'} width="w-[520px]"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => { resetDefaults(); onClose(); }} className="gap-1.5 text-xs">
            <RotateCcw className="h-3 w-3" />
            {isRTL ? 'إعادة تعيين' : 'Reset'}
          </Button>
          <Button size="sm" onClick={onClose} className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700">
            <Save className="h-3 w-3" />
            {isRTL ? 'حفظ' : 'Save'}
          </Button>
        </>
      }
    >
      {/* Tabs */}
      <div className={cn('flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5 mb-3', isRTL && 'flex-row-reverse')}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'tools' && <ToolsTab data={data.tools} isRTL={isRTL} onAdd={addTool} onUpdate={updateTools} onRemove={removeTool} expandedTier={expandedTier} setExpandedTier={setExpandedTier} />}
        {activeTab === 'journey' && <JourneyTab data={data.journey} isRTL={isRTL} onAdd={addJourneyStep} onUpdate={updateJourneyStep} onRemove={removeJourneyStep} />}
        {activeTab === 'guides' && <GuidesTab data={data.guides} isRTL={isRTL} onAdd={addGuide} onRemove={removeGuide} />}
        {activeTab === 'connections' && <ConnectionsTab data={data.connections} isRTL={isRTL} onUpdate={updateConnections} />}
      </div>
    </EditorSidebar>
  );
}

function ToolsTab({ data, isRTL, onAdd, onUpdate, onRemove, expandedTier, setExpandedTier }: {
  data: ArchitectureTool[];
  isRTL: boolean;
  onAdd: (tool: ArchitectureTool) => void;
  onUpdate: (tools: ArchitectureTool[]) => void;
  onRemove: (id: string) => void;
  expandedTier: string | null;
  setExpandedTier: (t: string | null) => void;
}) {
  const [editingTool, setEditingTool] = useState<ArchitectureTool | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const grouped: Record<string, ArchitectureTool[]> = { client: [], application: [], database: [] };
  data.forEach((t) => grouped[t.tier].push(t));

  const tierLabels: Record<string, string> = { client: 'Client Tier', application: 'Application Tier', database: 'Database Tier' };
  const tierLabelsAr: Record<string, string> = { client: 'طبقة العميل', application: 'طبقة التطبيقات', database: 'طبقة قاعدة البيانات' };
  const tierColors: Record<string, string> = { client: 'text-emerald-400', application: 'text-blue-400', database: 'text-amber-400' };

  const saveTool = (tool: ArchitectureTool) => {
    const exists = data.find((t) => t.id === tool.id);
    if (exists) {
      onUpdate(data.map((t) => (t.id === tool.id ? tool : t)));
    } else {
      onAdd(tool);
    }
    setEditingTool(null);
    setShowAdd(false);
  };

  return (
    <>
      {TIER_OPTIONS.map((tier) => (
        <Card key={tier} className="bg-white/[0.02] border-white/5">
          <button
            onClick={() => setExpandedTier(expandedTier === tier ? null : tier)}
            className={cn('w-full flex items-center justify-between px-4 py-3', isRTL && 'flex-row-reverse')}
          >
            <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
              <span className={cn('text-xs font-semibold', tierColors[tier])}>{isRTL ? tierLabelsAr[tier] : tierLabels[tier]}</span>
              <Badge variant="secondary" className="text-[9px]">{grouped[tier].length}</Badge>
            </div>
            {expandedTier === tier ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {expandedTier === tier && (
            <CardContent className="p-3 pt-0 space-y-2">
              {grouped[tier].map((tool) => (
                <div key={tool.id} className={cn('flex items-center gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors', isRTL && 'flex-row-reverse')}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{tool.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tool.icon}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setEditingTool(tool)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-600" onClick={() => onRemove(tool.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-[10px]" onClick={() => { setEditingTool({ id: `tool-${Date.now()}`, tier, name: '', roleTitle: '', description: '', integrationBenefit: '', icon: 'Globe' }); setShowAdd(true); }}>
                <Plus className="h-3 w-3" /> {isRTL ? 'إضافة مكون' : 'Add Component'}
              </Button>
            </CardContent>
          )}
        </Card>
      ))}

      {(editingTool || showAdd) && (
        <ToolEditDialog
          tool={editingTool!}
          isRTL={isRTL}
          onSave={saveTool}
          onCancel={() => { setEditingTool(null); setShowAdd(false); }}
        />
      )}
    </>
  );
}

function ToolEditDialog({ tool, isRTL, onSave, onCancel }: { tool: ArchitectureTool; isRTL: boolean; onSave: (t: ArchitectureTool) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...tool });

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xs font-bold">{isRTL ? 'تعديل المكون' : 'Edit Component'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2 max-h-[50vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label className="text-xs">{isRTL ? 'الاسم' : 'Name'}</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-8 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tier</Label>
              <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as any })} className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                {TIER_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Icon</Label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">roleTitle (i18n key)</Label>
            <Input value={form.roleTitle} onChange={(e) => setForm({ ...form, roleTitle: e.target.value })} className="h-8 text-xs font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">description (i18n key)</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-8 text-xs font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">integrationBenefit (i18n key)</Label>
            <Input value={form.integrationBenefit} onChange={(e) => setForm({ ...form, integrationBenefit: e.target.value })} className="h-8 text-xs font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{isRTL ? 'رابط الدليل' : 'Guide Title (i18n key)'}</Label>
            <Input value={form.relatedGuideTitle || ''} onChange={(e) => setForm({ ...form, relatedGuideTitle: e.target.value || undefined })} className="h-8 text-xs font-mono" placeholder="arch.guides.xxx" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Service Key</Label>
            <select value={form.serviceKey || ''} onChange={(e) => setForm({ ...form, serviceKey: (e.target.value || undefined) as any })} className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
              <option value="">None</option>
              {SERVICE_KEY_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onCancel} className="text-xs">Cancel</Button>
          <Button size="sm" onClick={() => onSave(form)} className="text-xs bg-amber-600 hover:bg-amber-700">
            <Save className="h-3 w-3 me-1" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JourneyTab({ data, isRTL, onAdd, onUpdate, onRemove }: {
  data: JourneyStep[];
  isRTL: boolean;
  onAdd: (step: JourneyStep) => void;
  onUpdate: (id: number, updates: Partial<JourneyStep>) => void;
  onRemove: (id: number) => void;
}) {
  const [editing, setEditing] = useState<JourneyStep | null>(null);

  return (
    <>
      <div className="space-y-2">
        {data.map((step) => (
          <div key={step.id} className={cn('flex items-center gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02]', isRTL && 'flex-row-reverse')}>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
              <span className="text-[10px] font-bold text-amber-400">{step.id}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{step.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{step.description}</p>
            </div>
            <Badge variant="outline" className="text-[9px] shrink-0">{step.highlightTier}</Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => setEditing(step)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 shrink-0" onClick={() => onRemove(step.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-[10px]" onClick={() => {
          const maxId = data.length > 0 ? Math.max(...data.map((s) => s.id)) : 0;
          onAdd({ id: maxId + 1, title: '', description: '', highlightTier: 'client', highlightToolIds: [] });
        }}>
          <Plus className="h-3 w-3" /> {isRTL ? 'إضافة خطوة' : 'Add Step'}
        </Button>
      </div>

      {editing && (
        <JourneyEditDialog step={editing} isRTL={isRTL} onSave={(s) => { onUpdate(s.id, s); setEditing(null); }} onCancel={() => setEditing(null)} />
      )}
    </>
  );
}

function JourneyEditDialog({ step, isRTL, onSave, onCancel }: { step: JourneyStep; isRTL: boolean; onSave: (s: JourneyStep) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...step, highlightToolIdsStr: step.highlightToolIds.join(', ') });

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xs font-bold">{isRTL ? 'تعديل خطوة' : 'Edit Step'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">{isRTL ? 'العنوان' : 'Title'}</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-8 text-xs font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{isRTL ? 'الوصف' : 'Description'}</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-8 text-xs font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tier</Label>
              <select value={form.highlightTier} onChange={(e) => setForm({ ...form, highlightTier: e.target.value as any })} className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                {TIER_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{isRTL ? 'معرّفات المكونات' : 'Tool IDs'}</Label>
              <Input value={form.highlightToolIdsStr} onChange={(e) => setForm({ ...form, highlightToolIdsStr: e.target.value })} className="h-8 text-xs" placeholder="web-browser, java-jre" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onCancel} className="text-xs">Cancel</Button>
          <Button size="sm" onClick={() => onSave({ ...form, highlightToolIds: form.highlightToolIdsStr.split(',').map((s) => s.trim()).filter(Boolean) })} className="text-xs bg-amber-600 hover:bg-amber-700">
            <Save className="h-3 w-3 me-1" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GuidesTab({ data, isRTL, onAdd, onRemove }: {
  data: GuideCard[];
  isRTL: boolean;
  onAdd: (g: GuideCard) => void;
  onRemove: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<GuideCard>({ id: '', title: '', description: '', href: '' });

  const handleAdd = () => {
    if (form.id && form.title) {
      onAdd(form);
      setForm({ id: '', title: '', description: '', href: '' });
      setShowAdd(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {data.map((guide) => (
          <div key={guide.id} className={cn('flex items-center gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02]', isRTL && 'flex-row-reverse')}>
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{guide.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{guide.href || 'No link'}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 shrink-0" onClick={() => onRemove(guide.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {showAdd ? (
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-3 space-y-2">
            <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="ID" className="h-7 text-xs" />
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title (i18n key)" className="h-7 text-xs font-mono" />
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (i18n key)" className="h-7 text-xs font-mono" />
            <Input value={form.href || ''} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="PDF URL" className="h-7 text-xs" />
            <div className="flex gap-2">
              <Button size="sm" className="text-[10px] bg-amber-600" onClick={handleAdd}>Save</Button>
              <Button size="sm" variant="outline" className="text-[10px]" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-[10px]" onClick={() => setShowAdd(true)}>
          <Plus className="h-3 w-3" /> {isRTL ? 'إضافة دليل' : 'Add Guide'}
        </Button>
      )}
    </>
  );
}

function ConnectionsTab({ data, isRTL, onUpdate }: {
  data: Connection[];
  isRTL: boolean;
  onUpdate: (c: Connection[]) => void;
}) {
  return (
    <div className="space-y-2">
      {data.map((conn, i) => (
        <Card key={i} className="bg-white/[0.02] border-white/5">
          <CardContent className="p-3 space-y-2">
            <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
              <Badge variant="outline" className="text-[9px]">{conn.from}</Badge>
              <Link2 className="h-3 w-3 text-muted-foreground" />
              <Badge variant="outline" className="text-[9px]">{conn.to}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Protocol</Label>
                <Input
                  value={conn.protocol}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[i] = { ...updated[i], protocol: e.target.value };
                    onUpdate(updated);
                  }}
                  className="h-7 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Port</Label>
                <Input
                  value={conn.port}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[i] = { ...updated[i], port: e.target.value };
                    onUpdate(updated);
                  }}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
