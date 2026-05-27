'use client';

import { create } from 'zustand';
import { useUndoStore } from '@/store/undo-store';
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
} from '@/types';
import { DEFAULT_EXPORT_SETTINGS, DEFAULT_PREVIEW_PREFERENCES } from '@/lib/constants';

const STORAGE_KEY = 'cloudicon-editor-state';

function loadHistory(): ExportEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('cloudicon-export-history');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(history: ExportEntry[]) {
  try {
    localStorage.setItem('cloudicon-export-history', JSON.stringify(history.slice(0, 50)));
  } catch {}
}

function loadPersistedState(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const fields: (keyof typeof initialState)[] = [
      'image', 'padding', 'rotation', 'zoom', 'backgroundColor',
      'backgroundType', 'gradientPreset', 'previewPreferences',
      'panX', 'panY', 'showGrid', 'safeArea',
    ];
    const result: any = {};
    for (const key of fields) {
      if (parsed[key] !== undefined) result[key] = parsed[key];
    }
    return result;
  } catch { return {}; }
}

function savePersistedState(state: any) {
  try {
    const fields: string[] = [
      'image', 'padding', 'rotation', 'zoom', 'backgroundColor',
      'backgroundType', 'gradientPreset', 'previewPreferences',
      'panX', 'panY', 'showGrid', 'safeArea',
    ];
    const data: Record<string, any> = {};
    for (const key of fields) {
      data[key] = state[key];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

let _hydrated = false;

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

  setImage: (image: ImageInfo) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setPan: (panX: number, panY: number) => void;
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
    safeArea: { show: true, android: true, iOS: true, web: true },
    showGrid: false,
    padding: 0,
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

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setImage: (image) => set({ image }),
  setZoom: (zoom) => set({ zoom }),
  setRotation: (rotation) => set({ rotation }),
  setPan: (panX, panY) => set({ panX, panY }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setBackgroundType: (backgroundType) => set({ backgroundType }),
  setGradientPreset: (gradientPreset) => set({ gradientPreset }),
  setGradient: (gradientPreset) => set({ backgroundType: 'gradient' as BackgroundType, gradientPreset }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setActiveTab: (activeTab) => set({ activeTab }),

  setCrop: (crop) =>
    set((state) => ({
      crop: crop === null
        ? { enabled: false, aspectRatio: '1:1', x: 0, y: 0, width: 0, height: 0 }
        : { ...state.crop, ...crop },
    })),

  setSafeArea: (settings) =>
    set((state) => ({ safeArea: { ...state.safeArea, ...settings } })),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setPadding: (padding) => set({ padding }),
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
  setExportOption: (key, value) => set({ [key]: value } as any),
  setNamingStyle: (namingStyle) => set({ namingStyle }),
  addExportEntry: (entry) =>
    set((state) => {
      const history = [entry, ...state.history].slice(0, 50);
      saveHistory(history);
      return { history };
    }),
  clearExportHistory: () => {
    saveHistory([]);
    return { history: [] };
  },
  undo: () => {
    const snapshot = useUndoStore.getState().undo();
    if (snapshot) {
      set({
        padding: snapshot.padding,
        rotation: snapshot.rotation,
        zoom: snapshot.zoom,
        backgroundColor: snapshot.backgroundColor,
        backgroundType: snapshot.backgroundType as BackgroundType,
        gradientPreset: snapshot.gradientPreset,
        showGrid: snapshot.showGrid,
        previewPreferences: { ...useEditorStore.getState().previewPreferences, iconShape: snapshot.iconShape as IconShape },
      });
    }
  },
  redo: () => {
    const snapshot = useUndoStore.getState().redo();
    if (snapshot) {
      set({
        padding: snapshot.padding,
        rotation: snapshot.rotation,
        zoom: snapshot.zoom,
        backgroundColor: snapshot.backgroundColor,
        backgroundType: snapshot.backgroundType as BackgroundType,
        gradientPreset: snapshot.gradientPreset,
        showGrid: snapshot.showGrid,
        previewPreferences: { ...useEditorStore.getState().previewPreferences, iconShape: snapshot.iconShape as IconShape },
      });
    }
  },
  reset: () => {
    saveHistory([]);
    return set(initialState);
  },
}));

export function rehydrateStore() {
  if (_hydrated) return;
  _hydrated = true;
  const persisted = loadPersistedState();
  if (Object.keys(persisted).length > 0) {
    useEditorStore.setState(persisted);
  }
}

if (typeof window !== 'undefined') {
  useEditorStore.subscribe((state) => {
    if (_hydrated) savePersistedState(state);
  });
}
