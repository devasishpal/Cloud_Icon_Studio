export interface ImageInfo {
  file: File | null;
  dataUrl: string | null;
  width: number;
  height: number;
}

export interface GeneratedIcon {
  platform: 'android' | 'ios' | 'web';
  name: string;
  size: number;
  dataUrl: string;
}

export interface ExportSettings {
  format: 'png' | 'webp' | 'jpeg';
  quality: number;
  padding: number;
  borderRadius: number;
  background: string;
}

export type ActiveTool =
  | 'select'
  | 'crop'
  | 'zoom'
  | 'rotate'
  | 'background'
  | 'safe-area'
  | 'grid'
  | 'pan'
  | 'shape'
  | 'padding';

export type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'processing' | 'success' | 'error';

export type BackgroundType = 'solid' | 'gradient' | 'transparent' | 'image';

export interface GradientPreset {
  name: string;
  colors: [string, string];
  angle: number;
}

export interface CropState {
  enabled: boolean;
  aspectRatio: '1:1' | '4:3' | '16:9' | 'free' | 'custom';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SafeAreaSettings {
  show: boolean;
  android: boolean;
  iOS: boolean;
  web: boolean;
}

export type PreviewTabType = 'android' | 'ios' | 'web' | 'desktop' | 'all';
export type IconShape = 'circle' | 'squircle' | 'rounded-square' | 'teardrop';
export type DeviceStyle = 'pixel' | 'samsung' | 'iphone' | 'ipad';
export type BrowserType = 'chrome' | 'safari' | 'edge' | 'firefox';
export type PreviewTheme = 'dark' | 'light';

export interface PreviewPreferences {
  theme: PreviewTheme;
  iconShape: IconShape;
  deviceStyle: DeviceStyle;
  browserType: BrowserType;
  showLabels: boolean;
  showShadows: boolean;
  launcherStyle: 'pixel' | 'samsung' | 'oneui';
  androidWallpaper: string;
  iosWallpaper: string;
}

export interface EditorState {
  image: ImageInfo;
  zoom: number;
  rotation: number;
  panX: number;
  panY: number;
  backgroundColor: string;
  backgroundType: BackgroundType;
  gradientPreset: GradientPreset | null;
  activeTool: ActiveTool;
  activeTab: 'upload' | 'editor' | 'android' | 'ios' | 'web' | 'desktop' | 'all' | 'export';
  crop: CropState;
  safeArea: SafeAreaSettings;
  showGrid: boolean;
  padding: number;
  canvasWidth: number;
  canvasHeight: number;
  generatedIcons: GeneratedIcon[];
  exportSettings: ExportSettings;
  uploadStatus: UploadStatus;
  uploadProgress: number;
  previewPreferences: PreviewPreferences;
  previewTab: PreviewTabType;
}

export interface NavItem {
  label: string;
  value: EditorState['activeTab'];
  icon: string;
}

export type Theme = 'dark' | 'light' | 'system';

export type CompressionLevel = 'low' | 'balanced' | 'maximum';

export type NamingStyle = 'lowercase' | 'uppercase' | 'original';

export interface ExportProgress {
  stage: 'idle' | 'preparing' | 'rendering' | 'generating' | 'packaging' | 'downloading' | 'done' | 'error';
  progress: number;
  total: number;
  message: string;
  platform?: string;
  error?: string;
}

export interface ExportEntry {
  id: string;
  date: string;
  preset: string;
  name: string;
  size: number;
  fileCount: number;
  compressionLevel: CompressionLevel;
}

export interface ExportSettingsState {
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
}
