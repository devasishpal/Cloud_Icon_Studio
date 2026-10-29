'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { renderIconDataUrl, renderIconDataUrlSync, type RenderConfig } from '@/lib/render';
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_EFFECTS,
  DEFAULT_FIT,
  DEFAULT_TRANSFORM,
} from '@/lib/constants';

type PreviewThemeName = 'dark' | 'light' | null;

/**
 * Local, dependency-free content fingerprint. Keeping this in the hook means
 * preview keys can never break because a newly added export is missing from a
 * stale module instance (the "imageSignature is not a function" failure).
 */
function imageSignature(image: { dataUrl?: string | null; width?: number; height?: number } | null | undefined): string {
  const url = image?.dataUrl ?? '';
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const step = Math.max(1, Math.floor(url.length / 4096));
  for (let i = 0; i < url.length; i += step) {
    const code = url.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 16777619) >>> 0;
    h2 = Math.imul(h2 + code, 2246822519) >>> 0;
  }
  return `${url.length.toString(36)}-${h1.toString(36)}-${h2.toString(36)}:${image?.width ?? 0}x${image?.height ?? 0}`;
}

function buildConfig(
  state: ReturnType<typeof useEditorStore.getState>,
  size: number,
  monochrome: PreviewThemeName,
  includeBackground: boolean
): RenderConfig {
  return {
    image: state.image,
    size,
    padding: state.padding ?? 0,
    rotation: state.rotation ?? 0,
    backgroundColor: state.backgroundColor ?? '#7C3AED',
    backgroundType: state.backgroundType ?? 'solid',
    gradientPreset: state.gradientPreset ?? null,
    iconShape: state.previewPreferences?.iconShape ?? 'squircle',
    fit: state.fit ?? DEFAULT_FIT,
    transform: state.transform ?? DEFAULT_TRANSFORM,
    adjustments: state.adjustments ?? DEFAULT_ADJUSTMENTS,
    effects: state.effects ?? DEFAULT_EFFECTS,
    includeBackground,
    includeShape: true,
    includeEffects: true,
    monochromeColor: monochrome ? (monochrome === 'dark' ? '#ffffff' : '#1a1a1e') : null,
  };
}

function previewKey(
  state: ReturnType<typeof useEditorStore.getState>,
  size: number,
  monochrome: PreviewThemeName,
  includeBackground: boolean
): string {
  const img = state.image;
  const signature = imageSignature(img);
  const g = state.gradientPreset;
  const transform = state.transform ?? DEFAULT_TRANSFORM;
  const adjustments = state.adjustments ?? DEFAULT_ADJUSTMENTS;
  const effects = state.effects ?? DEFAULT_EFFECTS;
  return [
    signature,
    size,
    state.padding ?? 0,
    state.rotation ?? 0,
    state.backgroundColor ?? '',
    state.backgroundType ?? '',
    g ? `${g.colors[0]}-${g.colors[1]}-${g.angle}` : '',
    state.previewPreferences?.iconShape ?? '',
    state.fit ?? '',
    transform.scale,
    transform.offsetX,
    transform.offsetY,
    adjustments.brightness,
    adjustments.contrast,
    adjustments.saturation,
    adjustments.hue,
    adjustments.blur,
    adjustments.grayscale,
    adjustments.opacity,
    effects.shadow,
    effects.shadowColor,
    effects.borderWidth,
    effects.borderColor,
    effects.flipX ? 1 : 0,
    effects.flipY ? 1 : 0,
    monochrome ?? '',
    includeBackground ? 1 : 0,
  ].join('|');
}

/**
 * Renders the exact same icon that the exporter produces, so every editor
 * change is reflected in the preview mockups.
 */
export function usePreviewIcon(
  size = 256,
  monochrome: PreviewThemeName = null,
  includeBackground = true
): string | null {
  const key = useEditorStore((s) => previewKey(s, size, monochrome, includeBackground));
  const imageKey = useEditorStore((s) => imageSignature(s.image));
  // Keep the previous render while a slider moves, but never return a URL that
  // belongs to a different source image. That was the "same image after a new
  // upload" symptom: React state still held the old preview for one paint.
  const [entry, setEntry] = useState<{ imageKey: string; url: string | null }>({
    imageKey,
    url: null,
  });

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      const state = useEditorStore.getState();
      if (!state.image?.dataUrl) {
        setEntry({ imageKey, url: null });
        return;
      }
      const config = buildConfig(state, size, monochrome, includeBackground);
      const sync = renderIconDataUrlSync(config);
      if (sync) {
        setEntry({ imageKey, url: sync });
        return;
      }
      renderIconDataUrl(config)
        .then((next) => {
          if (!cancelled) setEntry({ imageKey, url: next });
        })
        .catch(() => {
          // Keep the previous preview on decode errors.
        });
    };
    const raf = requestAnimationFrame(run);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [key, imageKey, size, monochrome, includeBackground]);

  return entry.imageKey === imageKey ? entry.url : null;
}
