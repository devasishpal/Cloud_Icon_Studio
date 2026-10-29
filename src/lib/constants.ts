import type {
  ImageTransform,
  ImageAdjustments,
  ImageEffects,
  ImageFit,
} from '@/types';

export const APP_NAME = 'CloudIcon Studio';
export const APP_TAGLINE = 'Generate Perfect App Icons for Android, iOS & Web';
export const APP_DESCRIPTION = 'Upload once. Instantly generate launcher icons, favicons, mipmaps, adaptive icons, and complete export packs.';
export const GITHUB_URL = 'https://github.com/devasishpal/Cloud_Icon_Studio';

export const ACCEPTED_FORMATS = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
};

export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const ANDROID_SIZES = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 },
];

export const ANDROID_DENSITIES = [
  { name: 'ldpi', scale: 0.75 },
  { name: 'mdpi', scale: 1 },
  { name: 'hdpi', scale: 1.5 },
  { name: 'xhdpi', scale: 2 },
  { name: 'xxhdpi', scale: 3 },
  { name: 'xxxhdpi', scale: 4 },
];

export const iOS_SIZES = [
  { name: 'iPhone Notification', size: 40 },
  { name: 'iPhone Settings', size: 58 },
  { name: 'iPhone Spotlight', size: 80 },
  { name: 'iPhone App', size: 120 },
  { name: 'iPad Settings', size: 58 },
  { name: 'iPad Spotlight', size: 80 },
  { name: 'iPad App', size: 152 },
  { name: 'iPad Pro App', size: 167 },
  { name: 'App Store', size: 1024 },
];

export const WEB_SIZES = [
  { name: 'favicon-16', size: 16 },
  { name: 'favicon-32', size: 32 },
  { name: 'favicon-48', size: 48 },
  { name: 'apple-touch-icon', size: 180 },
  { name: 'android-chrome-192', size: 192 },
  { name: 'android-chrome-512', size: 512 },
  { name: 'maskable-512', size: 512 },
];

export const NAV_ITEMS = [
  { label: 'Upload', value: 'upload' as const, icon: 'Upload' },
  { label: 'Editor', value: 'editor' as const, icon: 'Wand2' },
  { label: 'Android', value: 'android' as const, icon: 'Smartphone' },
  { label: 'iOS', value: 'ios' as const, icon: 'Apple' },
  { label: 'Web', value: 'web' as const, icon: 'Globe' },
  { label: 'Desktop', value: 'desktop' as const, icon: 'Monitor' },
  { label: 'Export', value: 'export' as const, icon: 'Download' },
];

export const DEFAULT_EXPORT_SETTINGS = {
  format: 'png' as const,
  quality: 90,
  padding: 0,
  borderRadius: 0,
  background: '#ffffff',
};

export const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1' as const },
  { label: '4:3', value: '4:3' as const },
  { label: '16:9', value: '16:9' as const },
  { label: 'Free', value: 'free' as const },
  { label: 'Custom', value: 'custom' as const },
];

export const GRADIENT_PRESETS = [
  { name: 'Purple Haze', colors: ['#7C3AED', '#A855F7'] as [string, string], angle: 135 },
  { name: 'Ocean Blue', colors: ['#2563EB', '#06B6D4'] as [string, string], angle: 135 },
  { name: 'Sunset', colors: ['#F59E0B', '#EF4444'] as [string, string], angle: 135 },
  { name: 'Emerald', colors: ['#10B981', '#059669'] as [string, string], angle: 135 },
  { name: 'Rose', colors: ['#EC4899', '#8B5CF6'] as [string, string], angle: 135 },
  { name: 'Midnight', colors: ['#1E293B', '#0F172A'] as [string, string], angle: 135 },
  { name: 'Candy', colors: ['#F472B6', '#38BDF8'] as [string, string], angle: 120 },
  { name: 'Citrus', colors: ['#FDE047', '#F97316'] as [string, string], angle: 160 },
  { name: 'Aurora', colors: ['#22D3EE', '#4ADE80'] as [string, string], angle: 45 },
];

export const ANDROID_SAFE_ZONE = { outerRadius: 0.45, innerRadius: 0.33 };
export const iOS_CORNER_RADIUS = 0.225;

export const ZOOM_MIN = 10;
export const ZOOM_MAX = 500;
export const ZOOM_STEP = 5;
export const PADDING_MIN = -20;
export const PADDING_MAX = 40;

export const DEVICE_PRESETS = {
  pixel: { name: 'Pixel 8', shellColor: '#1a1a2e', notch: 'center-punch' },
  samsung: { name: 'Galaxy S24', shellColor: '#0f0f14', notch: 'center-punch' },
  iphone: { name: 'iPhone 16 Pro', shellColor: '#1c1c1e', notch: 'dynamic-island' },
  ipad: { name: 'iPad Pro', shellColor: '#1c1c1e', notch: 'none' },
};

export const BROWSER_PRESETS = {
  chrome: { name: 'Chrome', color: '#4285F4' },
  safari: { name: 'Safari', color: '#007AFF' },
  edge: { name: 'Edge', color: '#0078D7' },
  firefox: { name: 'Firefox', color: '#FF7139' },
};

export const ICON_SHAPES = [
  { label: 'Circle', value: 'circle' as const },
  { label: 'Squircle', value: 'squircle' as const },
  { label: 'Rounded', value: 'rounded-square' as const },
  { label: 'Teardrop', value: 'teardrop' as const },
  { label: 'Square', value: 'square' as const },
];

export const DEFAULT_PREVIEW_PREFERENCES = {
  theme: 'dark' as const,
  iconShape: 'squircle' as const,
  deviceStyle: 'pixel' as const,
  browserType: 'chrome' as const,
  showLabels: true,
  showShadows: true,
  launcherStyle: 'pixel' as const,
  androidWallpaper: '/wallpapers/android-stock.webp',
  iosWallpaper: '/wallpapers/ios-stock-orange.webp',
};

export const DEFAULT_TRANSFORM: ImageTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  grayscale: 0,
  opacity: 100,
};

export const DEFAULT_EFFECTS: ImageEffects = {
  shadow: 0,
  shadowColor: '#000000',
  borderWidth: 0,
  borderColor: '#ffffff',
  flipX: false,
  flipY: false,
};

export const DEFAULT_FIT: ImageFit = 'contain';

/** Common iOS launch-screen sizes (portrait + landscape). */
export const SPLASH_SIZES = [
  { name: 'splash-iphone-1170x2532', width: 1170, height: 2532 },
  { name: 'splash-iphone-2532x1170', width: 2532, height: 1170 },
  { name: 'splash-iphone-1242x2688', width: 1242, height: 2688 },
  { name: 'splash-iphone-2688x1242', width: 2688, height: 1242 },
  { name: 'splash-ipad-2048x2732', width: 2048, height: 2732 },
  { name: 'splash-ipad-2732x2048', width: 2732, height: 2048 },
];

/** Open Graph / social card sizes. */
export const SOCIAL_SIZES = [
  { name: 'og-image', width: 1200, height: 630 },
  { name: 'twitter-card', width: 1200, height: 600 },
  { name: 'social-square', width: 1080, height: 1080 },
];
