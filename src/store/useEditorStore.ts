'use client';

import { create } from 'zustand';
import { temporal } from 'zundo';
import { idbGet, idbSet, idbDel } from '@/lib/idb';
import type {
  EditorState,
  GeneratedIcon,
  ImageInfo,
  ExportSettings,
  ActiveTool,
  CropState,
  SafeAreaSettings,
  UploadStatus,
  BackgroundType,
  GradientPreset,
  PreviewTabType,
  PreviewPreferences,
  IconShape,
  DeviceStyle,
  BrowserType,
  PreviewTheme,
  CompressionLevel,
  NamingStyle,
  ExportProgress,
  ExportEntry,
  ImageTransform,
  ImageAdjustments,
  ImageEffects,
  ImageFit,
} from '@/types';
import {
  DEFAULT_EXPORT_SETTINGS,
  DEFAULT_PREVIEW_PREFERENCES,
  DEFAULT_TRANSFORM,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_EFFECTS,
  DEFAULT_FIT,
} from '@/lib/constants';
import { clearPreviewCache, loadImageElement } from '@/lib/render';

const STORAGE_KEY = 'cloudicon-editor-state-v2';
const HISTORY_KEY = 'cloudicon-export-history';

function loadHistory(): ExportEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ExportEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ExportEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    // Storage can be unavailable in private mode – history is non-critical.
  }
}

interface EditorStore extends EditorState {
  modalOpen: boolean;
  progress: ExportProgress | null;
  compressionLevel: CompressionLevel;
  exportName: string;
  exportPreset: string;
  includeREADME: boolean;
  includeManifests: boolean;
  includeSource: boolean;
  addTimestamp: boolean;
  namingStyle: NamingStyle;
  history: ExportEntry[];

  setImage: (image: ImageInfo, options?: { preserveEdits?: boolean }) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setPan: (panX: number, panY: number) => void;
  resetView: () => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundType: (type: BackgroundType) => void;
  setGradientPreset: (preset: GradientPreset | null) => void;
  setGradient: (preset: GradientPreset) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setActiveTab: (tab: EditorState['activeTab']) => void;
  setCrop: (crop: Partial<CropState> | null) => void;
  setSafeArea: (settings: Partial<SafeAreaSettings>) => void;
  toggleGrid: () => void;
  setPadding: (padding: number) => void;
  setFit: (fit: ImageFit) => void;
  setTransform: (transform: Partial<ImageTransform>) => void;
  resetTransform: () => void;
  setAdjustments: (adjustments: Partial<ImageAdjustments>) => void;
  resetAdjustments: () => void;
  setEffects: (effects: Partial<ImageEffects>) => void;
  resetEffects: () => void;
  setCanvasSize: (width: number, height: number) => void;
  addGeneratedIcon: (icon: GeneratedIcon) => void;
  setGeneratedIcons: (icons: GeneratedIcon[]) => void;
  setExportSettings: (settings: Partial<ExportSettings>) => void;
  setUploadStatus: (status: UploadStatus) => void;
  setUploadProgress: (progress: number) => void;
  setPreviewTab: (tab: PreviewTabType) => void;
  setPreviewPreferences: (prefs: Partial<PreviewPreferences>) => void;
  setPreviewTheme: (theme: PreviewTheme) => void;
  setIconShape: (shape: IconShape) => void;
  setDeviceStyle: (style: DeviceStyle) => void;
  setBrowserType: (browser: BrowserType) => void;
  setExportModalOpen: (open: boolean) => void;
  setExportProgress: (progress: ExportProgress | null) => void;
  setCompressionLevel: (level: CompressionLevel) => void;
  setExportName: (name: string) => void;
  setExportPreset: (preset: string) => void;
  setExportOption: (key: 'includeREADME' | 'includeManifests' | 'includeSource' | 'addTimestamp', value: boolean) => void;
  setNamingStyle: (style: NamingStyle) => void;
  addExportEntry: (entry: ExportEntry) => void;
  clearExportHistory: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const initialState = {
  image: { file: null, dataUrl: null, width: 0, height: 0 },
  zoom: 100,
  rotation: 0,
  panX: 0,
  panY: 0,
  backgroundColor: '#7C3AED',
  backgroundType: 'solid' as BackgroundType,
  gradientPreset: null,
  activeTool: 'select' as ActiveTool,
  activeTab: 'upload' as EditorState['activeTab'],
  crop: { enabled: false, aspectRatio: '1:1' as const, x: 0, y: 0, width: 0, height: 0 },
  safeArea: { show: true, android: true, iOS: false, web: false },
  showGrid: false,
  padding: 0,
  fit: DEFAULT_FIT,
  transform: { ...DEFAULT_TRANSFORM },
  adjustments: { ...DEFAULT_ADJUSTMENTS },
  effects: { ...DEFAULT_EFFECTS },
  canvasWidth: 800,
  canvasHeight: 600,
  generatedIcons: [] as GeneratedIcon[],
  exportSettings: DEFAULT_EXPORT_SETTINGS,
  uploadStatus: 'idle' as UploadStatus,
  uploadProgress: 0,
  previewPreferences: DEFAULT_PREVIEW_PREFERENCES,
  previewTab: 'android' as PreviewTabType,
  modalOpen: false,
  progress: null as ExportProgress | null,
  compressionLevel: 'balanced' as CompressionLevel,
  exportName: 'CloudIcon-Pack',
  exportPreset: 'full',
  includeREADME: true,
  includeManifests: true,
  includeSource: false,
  addTimestamp: true,
  namingStyle: 'lowercase' as NamingStyle,
  history: [] as ExportEntry[],
};

/** Fields that participate in undo/redo and persistence. */
function historySlice(state: EditorStore) {
  return {
    image: state.image,
    padding: state.padding,
    rotation: state.rotation,
    backgroundColor: state.backgroundColor,
    backgroundType: state.backgroundType,
    gradientPreset: state.gradientPreset,
    fit: state.fit,
    transform: state.transform,
    adjustments: state.adjustments,
    effects: state.effects,
    previewPreferences: state.previewPreferences,
    crop: state.crop,
    safeArea: state.safeArea,
    showGrid: state.showGrid,
  };
}

// Debounce history entries so dragging a slider produces a single undo step.
type HistoryArg = {
  pastState: ReturnType<typeof historySlice>;
  currentState: ReturnType<typeof historySlice>;
  deltaState: Partial<ReturnType<typeof historySlice>> | null | undefined;
};
let historyTimer: ReturnType<typeof setTimeout> | null = null;
let pendingHistory: HistoryArg | null = null;
let commitHistory: ((arg: HistoryArg) => void) | null = null;

function flushHistory() {
  if (historyTimer) {
    clearTimeout(historyTimer);
    historyTimer = null;
  }
  if (pendingHistory && commitHistory) {
    commitHistory(pendingHistory);
    pendingHistory = null;
  }
}

export const useEditorStore = create<EditorStore>()(
  temporal(
    (set) => ({
      ...initialState,
      history: loadHistory(),

      setImage: (image, options) => {
        // Any preview rendered from the previous artwork is invalid now.
        clearPreviewCache();
        set((state) => ({
          image,
          ...(options?.preserveEdits
            ? {}
            : {
                rotation: 0,
                transform: { ...DEFAULT_TRANSFORM },
                adjustments: { ...DEFAULT_ADJUSTMENTS },
                effects: { ...DEFAULT_EFFECTS },
                fit: DEFAULT_FIT,
                crop: { ...state.crop, enabled: false },
              }),
        }));
        // Persist the new artwork immediately. Waiting for the debounced
        // subscription meant a quick reload could restore the previous image
        // (or no image at all) and leave the canvas looking empty.
        void persistNow(true);
      },

      setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(500, Math.round(zoom))) }),
      setRotation: (rotation) => set({ rotation }),
      setPan: (panX, panY) => set({ panX, panY }),
      resetView: () => set({ zoom: 100, panX: 0, panY: 0 }),

      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setBackgroundType: (backgroundType) => set({ backgroundType }),
      setGradientPreset: (gradientPreset) => set({ gradientPreset }),
      setGradient: (gradientPreset) => set({ backgroundType: 'gradient', gradientPreset }),
      setActiveTool: (activeTool) => set({ activeTool }),
      setActiveTab: (activeTab) => set({ activeTab }),

      setCrop: (crop) =>
        set((state) => ({
          crop: crop === null
            ? { ...state.crop, enabled: false }
            : { ...state.crop, ...crop },
        })),

      setSafeArea: (settings) =>
        set((state) => {
          const next = { ...state.safeArea, ...settings };
          const platforms = ['android', 'iOS', 'web'] as const;
          const enabled = platforms.filter((key) => settings[key] === true);
          if (enabled.length > 0) {
            // Only one guide is drawn at a time – keep the canvas clean.
            const active = enabled[enabled.length - 1];
            for (const key of platforms) next[key] = key === active;
          } else if (settings.show === true && !platforms.some((key) => next[key])) {
            next.android = true;
          }
          return { safeArea: next };
        }),

      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      setPadding: (padding) => set({ padding: Math.max(-20, Math.min(40, padding)) }),
      setFit: (fit) => set({ fit }),
      setTransform: (transform) =>
        set((state) => ({ transform: { ...state.transform, ...transform } })),
      resetTransform: () => set({ transform: { ...DEFAULT_TRANSFORM } }),

      setAdjustments: (adjustments) =>
        set((state) => ({ adjustments: { ...state.adjustments, ...adjustments } })),
      resetAdjustments: () => set({ adjustments: { ...DEFAULT_ADJUSTMENTS } }),

      setEffects: (effects) =>
        set((state) => ({ effects: { ...state.effects, ...effects } })),
      resetEffects: () => set({ effects: { ...DEFAULT_EFFECTS } }),

      setCanvasSize: (canvasWidth, canvasHeight) => set({ canvasWidth, canvasHeight }),

      addGeneratedIcon: (icon) =>
        set((state) => ({ generatedIcons: [...state.generatedIcons, icon] })),

      setGeneratedIcons: (generatedIcons) => set({ generatedIcons }),

      setExportSettings: (settings) =>
        set((state) => ({ exportSettings: { ...state.exportSettings, ...settings } })),

      setUploadStatus: (uploadStatus) => set({ uploadStatus }),
      setUploadProgress: (uploadProgress) => set({ uploadProgress }),
      setPreviewTab: (previewTab) => set({ previewTab }),

      setPreviewPreferences: (prefs) =>
        set((state) => ({ previewPreferences: { ...state.previewPreferences, ...prefs } })),

      setPreviewTheme: (theme) =>
        set((state) => ({ previewPreferences: { ...state.previewPreferences, theme } })),

      setIconShape: (iconShape) =>
        set((state) => ({ previewPreferences: { ...state.previewPreferences, iconShape } })),

      setDeviceStyle: (deviceStyle) =>
        set((state) => ({ previewPreferences: { ...state.previewPreferences, deviceStyle } })),

      setBrowserType: (browserType) =>
        set((state) => ({ previewPreferences: { ...state.previewPreferences, browserType } })),

      setExportModalOpen: (modalOpen) => set({ modalOpen }),
      setExportProgress: (progress) => set({ progress }),
      setCompressionLevel: (compressionLevel) => set({ compressionLevel }),
      setExportName: (exportName) => set({ exportName }),
      setExportPreset: (exportPreset) => set({ exportPreset }),
      setExportOption: (key, value) => set({ [key]: value } as Partial<EditorStore>),
      setNamingStyle: (namingStyle) => set({ namingStyle }),

      addExportEntry: (entry) =>
        set((state) => {
          const history = [entry, ...state.history].slice(0, 50);
          saveHistory(history);
          return { history };
        }),

      clearExportHistory: () => {
        saveHistory([]);
        set({ history: [] });
      },

      undo: () => {
        flushHistory();
        useEditorStore.temporal.getState().undo();
      },

      redo: () => {
        flushHistory();
        useEditorStore.temporal.getState().redo();
      },

      reset: () => {
        flushHistory();
        useEditorStore.temporal.getState().clear();
        saveHistory([]);
        clearPreviewCache();
        if (typeof window !== 'undefined') queueDelete();
        set({ ...initialState, history: [] });
      },
    }),
    {
      limit: 80,
      partialize: (state) => historySlice(state as EditorStore),
      equality: (pastState, currentState) =>
        JSON.stringify(pastState) === JSON.stringify(currentState),
      handleSet: (handleSet) => (pastState, replace, currentState, deltaState) => {
        const typed = {
          pastState: pastState as ReturnType<typeof historySlice>,
          currentState: currentState as ReturnType<typeof historySlice>,
          deltaState: deltaState as Partial<ReturnType<typeof historySlice>> | null | undefined,
        };
        if (!pendingHistory) pendingHistory = typed;
        else {
          pendingHistory.currentState = typed.currentState;
          pendingHistory.deltaState = typed.deltaState;
        }
        // zundo passes its internal `_handleSet` here at runtime, but its
        // published types describe the public `setState` (1–2 arguments).
        type TemporalHandleSet = (
          pastState: EditorStore,
          replace: boolean | undefined,
          currentState: EditorStore,
          deltaState?: Partial<ReturnType<typeof historySlice>> | null
        ) => void;
        const temporalHandleSet = handleSet as unknown as TemporalHandleSet;
        commitHistory = (arg) => {
          temporalHandleSet(
            arg.pastState as EditorStore,
            replace,
            arg.currentState as EditorStore,
            arg.deltaState
          );
        };
        if (historyTimer) clearTimeout(historyTimer);
        historyTimer = setTimeout(() => {
          historyTimer = null;
          const pending = pendingHistory;
          pendingHistory = null;
          if (pending && commitHistory) {
            commitHistory(pending);
          }
        }, 320);
      },
    }
  )
);

let hydrationStarted = false;
let hydrationPromise: Promise<void> | null = null;

const RESTORABLE_IMAGE_RE = /^data:image\//i;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      }
    );
  });
}

/** Older sessions enabled all three safe-area guides at once. Keep one. */
function normalizeSafeArea(
  saved: SafeAreaSettings | undefined,
  current: SafeAreaSettings
): SafeAreaSettings {
  const merged = { ...current, ...(saved ?? {}) };
  const platforms = ['android', 'iOS', 'web'] as const;
  const enabled = platforms.filter((key) => merged[key]);
  if (enabled.length > 1) {
    const active = enabled[0];
    for (const key of platforms) merged[key] = key === active;
  } else if (merged.show && enabled.length === 0) {
    merged.android = true;
  }
  return merged;
}

/**
 * Validate a persisted image before it reaches the canvas. Blob URLs from an
 * older build die on reload, and a data URL that cannot be decoded would
 * otherwise leave a permanently blank artboard.
 */async function restoreImage(
  saved: Partial<EditorStore>,
  current: EditorStore
): Promise<ImageInfo> {
  const merged = { ...current.image, ...(saved.image ?? {}) } as ImageInfo;
  if (!merged.dataUrl) return { ...merged, dataUrl: null };
  if (!RESTORABLE_IMAGE_RE.test(merged.dataUrl)) return { ...merged, dataUrl: null };

  const img = await withTimeout(loadImageElement(merged.dataUrl), 12000);
  if (!img || !img.naturalWidth || !img.naturalHeight) {
    return { ...merged, dataUrl: null };
  }
  return { ...merged, width: img.naturalWidth, height: img.naturalHeight };
}

/**
 * Load the last session from IndexedDB. Safe to call more than once – the
 * same promise is returned so the editor can wait before deciding to redirect.
 */
export function rehydrateStore(): Promise<void> {
  if (hydrationPromise) return hydrationPromise;
  hydrationStarted = true;
  hydrationPromise = (async () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = await idbGet<Partial<EditorStore>>(STORAGE_KEY);
      if (!saved) return;
      const current = useEditorStore.getState();
      // Never clobber an image uploaded while hydration was in flight.
      if (current.image.dataUrl) return;

      const image = await restoreImage(saved, current);
      useEditorStore.setState({
        // Merge with current defaults so sessions saved by older builds keep
        // working when new fields (transform, effects, …) are introduced.
        ...current,
        ...saved,
        image,
        previewPreferences: { ...DEFAULT_PREVIEW_PREFERENCES, ...(saved.previewPreferences ?? {}) },
        transform: { ...DEFAULT_TRANSFORM, ...(saved.transform ?? {}) },
        adjustments: { ...DEFAULT_ADJUSTMENTS, ...(saved.adjustments ?? {}) },
        effects: { ...DEFAULT_EFFECTS, ...(saved.effects ?? {}) },
        crop: { ...current.crop, ...(saved.crop ?? {}) },
        safeArea: normalizeSafeArea(saved.safeArea, current.safeArea),
        fit: saved.fit ?? DEFAULT_FIT,
      });
      useEditorStore.temporal.getState().clear();
      if (image.dataUrl) persistNow(true);
    } catch {
      // IndexedDB can be blocked (private browsing) – the editor still works.
    }
  })();
  return hydrationPromise;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * IndexedDB writes must be serialized. Two overlapping writes (for example the
 * debounced save of the previous artwork and the immediate save of a new
 * upload) can otherwise complete out of order and resurrect the old image.
 */
let writeChain: Promise<void> = Promise.resolve();

function queuePersist(snapshot: ReturnType<typeof historySlice>): Promise<void> {
  writeChain = writeChain
    .then(() => idbSet(STORAGE_KEY, snapshot))
    .catch(() => undefined);
  return writeChain;
}

function queueDelete(): Promise<void> {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  writeChain = writeChain.then(() => idbDel(STORAGE_KEY)).catch(() => undefined);
  return writeChain;
}

/** Persist the current editable slice right away. */
function persistNow(force = false): Promise<void> {
  if ((!hydrationStarted && !force) || typeof window === 'undefined') {
    return writeChain;
  }
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  flushHistory();
  return queuePersist(historySlice(useEditorStore.getState()));
}

/**
 * Resolve once every queued IndexedDB write has finished. The upload flow
 * awaits this before navigating so the editor can never rehydrate old artwork.
 */
export function flushPersistence(): Promise<void> {
  if (typeof window === 'undefined') return writeChain;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  flushHistory();
  if (hydrationStarted) {
    queuePersist(historySlice(useEditorStore.getState()));
  }
  return writeChain;
}

if (typeof window !== 'undefined') {
  useEditorStore.subscribe(() => {
    if (!hydrationStarted) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      // Read the latest state when the timer fires, never a captured snapshot.
      queuePersist(historySlice(useEditorStore.getState()));
    }, 450);
  });

  // IndexedDB writes are asynchronous, but visibilitychange/pagehide fire
  // before the page is frozen, which is enough time to queue the write.
  window.addEventListener('pagehide', () => {
    void persistNow();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void persistNow();
  });
}
