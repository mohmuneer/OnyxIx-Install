'use client';

import { create } from 'zustand';
import {
  ARCHITECTURE_TOOLS as DEFAULT_TOOLS,
  JOURNEY_STEPS as DEFAULT_JOURNEY,
  ARCHITECTURE_GUIDES as DEFAULT_GUIDES,
  CONNECTIONS as DEFAULT_CONNECTIONS,
  type ArchitectureTool,
  type JourneyStep,
  type GuideCard,
} from '@/lib/architecture-data';

export interface Connection {
  from: string;
  to: string;
  protocol: string;
  port: string;
  protocolKey: string;
}

interface ArchitectureData {
  tools: ArchitectureTool[];
  journey: JourneyStep[];
  guides: GuideCard[];
  connections: Connection[];
}

interface ArchitectureStore {
  data: ArchitectureData;
  init: () => void;
  resetDefaults: () => void;
  updateTools: (tools: ArchitectureTool[]) => void;
  updateTool: (id: string, updates: Partial<ArchitectureTool>) => void;
  addTool: (tool: ArchitectureTool) => void;
  removeTool: (id: string) => void;
  updateJourney: (journey: JourneyStep[]) => void;
  addJourneyStep: (step: JourneyStep) => void;
  updateJourneyStep: (id: number, updates: Partial<JourneyStep>) => void;
  removeJourneyStep: (id: number) => void;
  updateGuides: (guides: GuideCard[]) => void;
  addGuide: (guide: GuideCard) => void;
  removeGuide: (id: string) => void;
  updateConnections: (connections: Connection[]) => void;
}

const STORAGE_KEY = 'architecture-data';
const VERSION_KEY = 'architecture-data-version';
const CURRENT_VERSION = 1;

function getDefaultData(): ArchitectureData {
  return {
    tools: DEFAULT_TOOLS,
    journey: DEFAULT_JOURNEY,
    guides: DEFAULT_GUIDES,
    connections: DEFAULT_CONNECTIONS,
  };
}

function loadFromStorage(): ArchitectureData | null {
  try {
    const ver = localStorage.getItem(VERSION_KEY);
    if (parseInt(ver || '0') < CURRENT_VERSION) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: ArchitectureData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  } catch {}
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
  data: getDefaultData(),

  init: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({ data: stored });
    }
  },

  resetDefaults: () => {
    const data = getDefaultData();
    set({ data });
    saveToStorage(data);
  },

  updateTools: (tools) => {
    const data = { ...get().data, tools };
    set({ data });
    saveToStorage(data);
  },

  updateTool: (id, updates) => {
    const tools = get().data.tools.map((t) => (t.id === id ? { ...t, ...updates } : t));
    const data = { ...get().data, tools };
    set({ data });
    saveToStorage(data);
  },

  addTool: (tool) => {
    const tools = [...get().data.tools, tool];
    const data = { ...get().data, tools };
    set({ data });
    saveToStorage(data);
  },

  removeTool: (id) => {
    const tools = get().data.tools.filter((t) => t.id !== id);
    const data = { ...get().data, tools };
    set({ data });
    saveToStorage(data);
  },

  updateJourney: (journey) => {
    const data = { ...get().data, journey };
    set({ data });
    saveToStorage(data);
  },

  addJourneyStep: (step) => {
    const journey = [...get().data.journey, step];
    const data = { ...get().data, journey };
    set({ data });
    saveToStorage(data);
  },

  updateJourneyStep: (id, updates) => {
    const journey = get().data.journey.map((s) => (s.id === id ? { ...s, ...updates } : s));
    const data = { ...get().data, journey };
    set({ data });
    saveToStorage(data);
  },

  removeJourneyStep: (id) => {
    const journey = get().data.journey.filter((s) => s.id !== id);
    const data = { ...get().data, journey };
    set({ data });
    saveToStorage(data);
  },

  updateGuides: (guides) => {
    const data = { ...get().data, guides };
    set({ data });
    saveToStorage(data);
  },

  addGuide: (guide) => {
    const guides = [...get().data.guides, guide];
    const data = { ...get().data, guides };
    set({ data });
    saveToStorage(data);
  },

  removeGuide: (id) => {
    const guides = get().data.guides.filter((g) => g.id !== id);
    const data = { ...get().data, guides };
    set({ data });
    saveToStorage(data);
  },

  updateConnections: (connections) => {
    const data = { ...get().data, connections };
    set({ data });
    saveToStorage(data);
  },
}));
