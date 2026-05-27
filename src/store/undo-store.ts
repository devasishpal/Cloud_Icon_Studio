'use client';

import { create } from 'zustand';

interface Snapshot {
  padding: number;
  rotation: number;
  zoom: number;
  backgroundColor: string;
  backgroundType: string;
  gradientPreset: any;
  showGrid: boolean;
  iconShape: string;
}

interface UndoStore {
  past: Snapshot[];
  future: Snapshot[];
  pushSnapshot: (snapshot: Snapshot) => void;
  undo: () => Snapshot | null;
  redo: () => Snapshot | null;
  clear: () => void;
}

const maxHistory = 50;

export const useUndoStore = create<UndoStore>((set, get) => ({
  past: [],
  future: [],

  pushSnapshot: (snapshot) =>
    set((state) => ({
      past: [...state.past.slice(-maxHistory + 1), snapshot],
      future: [],
    })),

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;
    const prev = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [prev, ...future],
    });
    return prev;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;
    const next = future[0];
    set({
      past: [...past, next],
      future: future.slice(1),
    });
    return next;
  },

  clear: () => set({ past: [], future: [] }),
}));
