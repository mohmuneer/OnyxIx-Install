'use client';

import { create } from 'zustand';

export interface SwStep {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  enabled: boolean;
}

const STORAGE_KEY = 'sw-deploy-steps';

const DEFAULT_STEPS: SwStep[] = [
  { id: 'check', name: 'Verify Source Files', nameAr: 'التحقق من الملفات المصدرية', icon: 'Search', description: 'Verify all source files exist in the installation media', descriptionAr: 'التحقق من وجود جميع الملفات المصدرية في وسيلة التثبيت', enabled: true },
  { id: 'mkdir', name: 'Create Directories', nameAr: 'إنشاء المجلدات', icon: 'FolderTree', description: 'Create all required directories on the target disk', descriptionAr: 'إنشاء جميع المجلدات المطلوبة على القرص المستهدف', enabled: true },
  { id: 'rename', name: 'Rename Originals', nameAr: 'إعادة تسمية الأصلية', icon: 'Shield', description: 'Backup original config files by renaming them to _def', descriptionAr: 'نسخ احتياطي من ملفات الإعدادات الأصلية بإعادة تسميتها إلى _def', enabled: true },
  { id: 'copy', name: 'Copy Files', nameAr: 'نسخ الملفات', icon: 'Copy', description: 'Copy all installation files from source to target', descriptionAr: 'نسخ جميع ملفات التثبيت من المصدر إلى الوجهة', enabled: true },
  { id: 'variables', name: 'Replace Variables', nameAr: 'استبدال المتغيرات', icon: 'ArrowRightLeft', description: 'Replace HOST and SERVICE_NAME in config files', descriptionAr: 'استبدال HOST وSERVICE_NAME في ملفات الإعدادات', enabled: true },
  { id: 'fonts', name: 'Install Fonts', nameAr: 'تثبيت الخطوط', icon: 'Type', description: 'Install barcode fonts to Oracle and Windows directories', descriptionAr: 'تثبيت خطوط الباركود في مجلدات Oracle وWindows', enabled: true },
  { id: 'services', name: 'Restart Services', nameAr: 'إعادة تشغيل الخدمات', icon: 'RotateCcw', description: 'Stop OPMN, clear cache, start Node Manager, Admin Server, WLS_FORMS, WLS_REPORTS, OPMN', descriptionAr: 'إيقاف OPMN، حذف الكاش، تشغيل Node Manager، Admin Server، WLS_FORMS، WLS_REPORTS، OPMN', enabled: true },
];

function loadFromStorage(): SwStep[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STEPS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_STEPS;
    return parsed;
  } catch {
    return DEFAULT_STEPS;
  }
}

function saveToStorage(steps: SwStep[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
  } catch {}
}

interface SwDeployStore {
  steps: SwStep[];
  init: () => void;
  resetDefaults: () => void;
  addStep: (step: SwStep) => void;
  updateStep: (id: string, updates: Partial<SwStep>) => void;
  removeStep: (id: string) => void;
  reorderSteps: (steps: SwStep[]) => void;
  toggleStep: (id: string) => void;
}

export const useSwDeployStore = create<SwDeployStore>((set, get) => ({
  steps: DEFAULT_STEPS,

  init: () => {
    const stored = loadFromStorage();
    set({ steps: stored });
  },

  resetDefaults: () => {
    set({ steps: DEFAULT_STEPS });
    saveToStorage(DEFAULT_STEPS);
  },

  addStep: (step) => {
    const steps = [...get().steps, step];
    set({ steps });
    saveToStorage(steps);
  },

  updateStep: (id, updates) => {
    const steps = get().steps.map((s) => (s.id === id ? { ...s, ...updates } : s));
    set({ steps });
    saveToStorage(steps);
  },

  removeStep: (id) => {
    const steps = get().steps.filter((s) => s.id !== id);
    set({ steps });
    saveToStorage(steps);
  },

  reorderSteps: (steps) => {
    set({ steps });
    saveToStorage(steps);
  },

  toggleStep: (id) => {
    const steps = get().steps.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    set({ steps });
    saveToStorage(steps);
  },
}));
