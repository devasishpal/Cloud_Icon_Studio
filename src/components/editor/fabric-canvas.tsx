'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { usePreviewIcon } from '@/components/previews/use-preview-icon';
import { frameToSourcePoint, loadImageElement, type RenderConfig } from '@/lib/render';
import { cropSourceImage, normalizeUpload } from '@/lib/image-ops';
import { getShapeClip } from '@/lib/utils';
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_EFFECTS,
  DEFAULT_FIT,
  DEFAULT_TRANSFORM,
} from '@/lib/constants';

const FRAME = 512;

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type CropHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

type Gesture =
  | { type: 'pan'; startX: number; startY: number; startPanX: number; startPanY: number }
  | {
      type: 'move';
      startX: number;
      startY: number;
      startOffsetX: number;
      startOffsetY: number;
      framePx: number;
    }
  | { type: 'scale'; startDist: number; startScale: number }
  | { type: 'rotate'; startAngle: number; startRotation: number }
  | { type: 'crop-move'; startX: number; startY: number; startRect: CropRect; framePx: number }
  | {
      type: 'crop-resize';
      handle: CropHandle;
      startX: number;
      startY: number;
      startRect: CropRect;
      framePx: number;
    };

export interface FabricCanvasHandle {
  applyCrop: () => void;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function aspectValue(ratio: string): number | null {
  if (ratio === '1:1') return 1;
  if (ratio === '4:3') return 4 / 3;
  if (ratio === '16:9') return 16 / 9;
  return null;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function buildRenderConfig(state: ReturnType<typeof useEditorStore.getState>): RenderConfig {
  return {
    image: state.image,
    size: FRAME,
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
  };
}

export const FabricCanvas = forwardRef<FabricCanvasHandle, object>(function FabricCanvas(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState({ w: 800, h: 600 });
  const [cropRect, setCropRect] = useState<CropRect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const cropRectRef = useRef(cropRect);
  cropRectRef.current = cropRect;

  const gestureRef = useRef<Gesture | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const image = useEditorStore((s) => s.image);
  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const rotation = useEditorStore((s) => s.rotation);
  const transform = useEditorStore((s) => s.transform);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const activeTool = useEditorStore((s) => s.activeTool);
  const crop = useEditorStore((s) => s.crop);
  const showGrid = useEditorStore((s) => s.showGrid);
  const safeArea = useEditorStore((s) => s.safeArea);
  const iconShape = useEditorStore((s) => s.previewPreferences.iconShape);
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const previewUrl = usePreviewIcon(768);
  // If a rendered preview ever fails to decode, fall back to the raw artwork
  // instead of showing an empty frame.
  const [previewFailed, setPreviewFailed] = useState(false);
  useEffect(() => {
    setPreviewFailed(false);
  }, [previewUrl]);
  const displayUrl = previewFailed ? image.dataUrl : previewUrl ?? image.dataUrl;

  const framePx = Math.max(120, Math.min(container.w, container.h) * 0.72 * (zoom / 100));

  const stateRef = useRef({
    framePx,
    zoom,
    panX,
    panY,
    transform,
    rotation,
  });
  stateRef.current = { framePx, zoom, panX, panY, transform, rotation };

  // Track container size.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 800;
      const h = el.clientHeight || 600;
      setContainer({ w, h });
      setCanvasSize(w, h);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [setCanvasSize]);

  // Reset the crop box when the crop tool is opened or its ratio changes.
  useEffect(() => {
    if (!crop.enabled) return;
    const ar = aspectValue(crop.aspectRatio);
    if (!ar) {
      setCropRect({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
      return;
    }
    const maxW = 0.8;
    const maxH = 0.8;
    let w = maxW;
    let h = w / ar;
    if (h > maxH) {
      h = maxH;
      w = h * ar;
    }
    setCropRect({ x: (1 - w) / 2, y: (1 - h) / 2, w, h });
  }, [crop.enabled, crop.aspectRatio]);

  const startGesture = useCallback((gesture: Gesture) => {
    gestureRef.current = gesture;
    setDragging(true);
  }, []);

  const handleArtworkFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const normalized = await normalizeUpload(file, dataUrl).catch(() => null);
      const finalUrl = normalized?.dataUrl ?? dataUrl;
      const img = await loadImageElement(finalUrl);
      useEditorStore.getState().setImage({
        file,
        dataUrl: finalUrl,
        width: normalized?.width ?? img.naturalWidth,
        height: normalized?.height ?? img.naturalHeight,
      });
    } catch {
      setUploadError('Could not load that image. Try another file.');
    } finally {
      setUploading(false);
    }
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    const store = useEditorStore.getState();

    if (gesture.type === 'pan') {
      store.setPan(
        gesture.startPanX + (e.clientX - gesture.startX),
        gesture.startPanY + (e.clientY - gesture.startY)
      );
      return;
    }

    if (gesture.type === 'move') {
      const dx = (e.clientX - gesture.startX) / gesture.framePx;
      const dy = (e.clientY - gesture.startY) / gesture.framePx;
      store.setTransform({
        offsetX: Math.max(-2, Math.min(2, gesture.startOffsetX + dx)),
        offsetY: Math.max(-2, Math.min(2, gesture.startOffsetY + dy)),
      });
      return;
    }

    if (gesture.type === 'scale') {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 + store.panX;
      const cy = rect.top + rect.height / 2 + store.panY;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const next = gesture.startScale * (dist / Math.max(1, gesture.startDist));
      store.setTransform({ scale: Math.max(0.1, Math.min(12, next)) });
      return;
    }

    if (gesture.type === 'rotate') {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 + store.panX;
      const cy = rect.top + rect.height / 2 + store.panY;
      const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
      let next = gesture.startRotation + (angle - gesture.startAngle);
      next = ((next + 180) % 360 + 360) % 360 - 180;
      store.setRotation(Math.round(next));
      return;
    }

    if (gesture.type === 'crop-move') {
      const dx = (e.clientX - gesture.startX) / gesture.framePx;
      const dy = (e.clientY - gesture.startY) / gesture.framePx;
      const x = Math.max(0, Math.min(1 - gesture.startRect.w, gesture.startRect.x + dx));
      const y = Math.max(0, Math.min(1 - gesture.startRect.h, gesture.startRect.y + dy));
      setCropRect({ ...gesture.startRect, x, y });
      return;
    }

    if (gesture.type === 'crop-resize') {
      const dx = (e.clientX - gesture.startX) / gesture.framePx;
      const dy = (e.clientY - gesture.startY) / gesture.framePx;
      const start = gesture.startRect;
      const ar = aspectValue(store.crop.aspectRatio);

      let left = start.x;
      let top = start.y;
      let right = start.x + start.w;
      let bottom = start.y + start.h;

      if (gesture.handle.includes('w')) left = clamp01(start.x + dx);
      if (gesture.handle.includes('e')) right = clamp01(start.x + start.w + dx);
      if (gesture.handle.includes('n')) top = clamp01(start.y + dy);
      if (gesture.handle.includes('s')) bottom = clamp01(start.y + start.h + dy);

      if (right - left < 0.04) {
        if (gesture.handle.includes('w')) left = right - 0.04;
        else right = left + 0.04;
      }
      if (bottom - top < 0.04) {
        if (gesture.handle.includes('n')) top = bottom - 0.04;
        else bottom = top + 0.04;
      }

      let w = right - left;
      let h = bottom - top;

      if (ar) {
        const horizontalOnly = gesture.handle === 'e' || gesture.handle === 'w';
        const verticalOnly = gesture.handle === 'n' || gesture.handle === 's';
        if (horizontalOnly) {
          h = w / ar;
          const cy = top + (bottom - top) / 2;
          top = cy - h / 2;
          bottom = cy + h / 2;
        } else if (verticalOnly) {
          w = h * ar;
          const cx = left + (right - left) / 2;
          left = cx - w / 2;
          right = cx + w / 2;
        } else {
          // Corner handle: use whichever axis moved further.
          if (Math.abs(dx) >= Math.abs(dy)) h = w / ar;
          else w = h * ar;
          if (gesture.handle.includes('n')) top = bottom - h;
          else bottom = top + h;
          if (gesture.handle.includes('w')) left = right - w;
          else right = left + w;
        }

        // Keep the box inside the frame while preserving the ratio.
        if (left < 0) {
          const shift = -left;
          left = 0;
          right += shift;
        }
        if (right > 1) {
          const shift = right - 1;
          right = 1;
          left -= shift;
        }
        if (top < 0) {
          const shift = -top;
          top = 0;
          bottom += shift;
        }
        if (bottom > 1) {
          const shift = bottom - 1;
          bottom = 1;
          top -= shift;
        }
        left = clamp01(left);
        top = clamp01(top);
        right = clamp01(right);
        bottom = clamp01(bottom);
        w = Math.max(0.04, right - left);
        h = Math.max(0.04, bottom - top);
        if (Math.abs(w / h - ar) > 0.01) {
          if (w / ar <= 1) h = w / ar;
          else {
            h = Math.min(1 - top, w / ar);
            w = h * ar;
          }
        }
      }

      setCropRect({
        x: clamp01(left),
        y: clamp01(top),
        w: Math.min(1 - clamp01(left), Math.max(0.04, w)),
        h: Math.min(1 - clamp01(top), Math.max(0.04, h)),
      });
    }
  }, []);

  useEffect(() => {
    const up = () => {
      if (!gestureRef.current) return;
      gestureRef.current = null;
      setDragging(false);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [handlePointerMove]);

  const onBackdropPointerDown = (e: React.PointerEvent) => {
    const store = useEditorStore.getState();
    const isPan = store.activeTool === 'pan' || e.button === 1 || e.altKey;
    if (!isPan) return;
    e.preventDefault();
    startGesture({
      type: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      startPanX: store.panX,
      startPanY: store.panY,
    });
  };

  const onFramePointerDown = (e: React.PointerEvent) => {
    const store = useEditorStore.getState();
    if (store.crop.enabled) return;
    if (store.activeTool === 'zoom') {
      store.setZoom(Math.min(500, store.zoom + 25));
      return;
    }
    if (store.activeTool !== 'select') return;
    e.preventDefault();
    e.stopPropagation();
    startGesture({
      type: 'move',
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: store.transform.offsetX,
      startOffsetY: store.transform.offsetY,
      framePx,
    });
  };

  const onScalePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const store = useEditorStore.getState();
    const cx = rect.left + rect.width / 2 + store.panX;
    const cy = rect.top + rect.height / 2 + store.panY;
    startGesture({
      type: 'scale',
      startDist: Math.max(1, Math.hypot(e.clientX - cx, e.clientY - cy)),
      startScale: store.transform.scale,
    });
  };

  const onRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const store = useEditorStore.getState();
    const cx = rect.left + rect.width / 2 + store.panX;
    const cy = rect.top + rect.height / 2 + store.panY;
    startGesture({
      type: 'rotate',
      startAngle: (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI,
      startRotation: store.rotation,
    });
  };

  const onCropPointerDown = (e: React.PointerEvent, handle?: CropHandle) => {
    e.stopPropagation();
    e.preventDefault();
    const store = useEditorStore.getState();
    if (!store.crop.enabled) return;
    if (handle) {
      startGesture({
        type: 'crop-resize',
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startRect: cropRectRef.current,
        framePx,
      });
    } else {
      startGesture({
        type: 'crop-move',
        startX: e.clientX,
        startY: e.clientY,
        startRect: cropRectRef.current,
        framePx,
      });
    }
  };

  const applyCrop = useCallback(() => {
    const store = useEditorStore.getState();
    if (!store.image.dataUrl) return;
    const rect = cropRectRef.current;
    const config = buildRenderConfig(store);
    const corners = [
      frameToSourcePoint(rect.x, rect.y, config, FRAME),
      frameToSourcePoint(rect.x + rect.w, rect.y, config, FRAME),
      frameToSourcePoint(rect.x, rect.y + rect.h, config, FRAME),
      frameToSourcePoint(rect.x + rect.w, rect.y + rect.h, config, FRAME),
    ];
    const xs = corners.map((p) => p.x);
    const ys = corners.map((p) => p.y);
    const minX = Math.max(0, Math.min(...xs));
    const minY = Math.max(0, Math.min(...ys));
    const maxX = Math.min(store.image.width, Math.max(...xs));
    const maxY = Math.min(store.image.height, Math.max(...ys));
    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);

    if (width < 2 || height < 2) return;

    cropSourceImage(store.image.dataUrl, minX, minY, width, height)
      .then((next) => {
        store.setImage(
          { file: store.image.file, dataUrl: next.dataUrl, width: next.width, height: next.height },
          { preserveEdits: true }
        );
        store.resetTransform();
        store.setRotation(0);
        store.setFit('contain');
        store.setCrop({ enabled: false });
        store.setActiveTool('select');
      })
      .catch(() => {
        // Ignore crop failures – the original image stays intact.
      });
  }, []);

  useImperativeHandle(ref, () => ({ applyCrop }), [applyCrop]);

  // Crop applies with Enter, but never while typing in an input.
  useEffect(() => {
    if (!crop.enabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCrop();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [crop.enabled, applyCrop]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const store = useEditorStore.getState();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cursorX = e.clientX - rect.left - rect.width / 2;
    const cursorY = e.clientY - rect.top - rect.height / 2;

    if (e.ctrlKey || e.metaKey || store.activeTool === 'zoom') {
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const nextZoom = Math.max(10, Math.min(500, store.zoom * factor));
      const ratio = nextZoom / store.zoom;
      store.setZoom(nextZoom);
      store.setPan(
        cursorX - (cursorX - store.panX) * ratio,
        cursorY - (cursorY - store.panY) * ratio
      );
    } else {
      store.setPan(
        store.panX - (e.shiftKey ? e.deltaY : e.deltaX),
        store.panY - (e.shiftKey ? 0 : e.deltaY)
      );
    }
  };

  const resetArtwork = () => {
    const store = useEditorStore.getState();
    store.resetTransform();
    store.setRotation(0);
  };

  const isTransparent = backgroundType === 'transparent';
  const cursor =
    activeTool === 'pan'
      ? dragging ? 'grabbing' : 'grab'
      : activeTool === 'crop'
        ? 'crosshair'
        : activeTool === 'zoom'
          ? 'zoom-in'
          : activeTool === 'select'
            ? dragging ? 'grabbing' : 'grab'
            : 'default';

  const cropAr = aspectValue(crop.aspectRatio);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden select-none"
      onPointerDown={onBackdropPointerDown}
      onWheel={onWheel}
      onDragOver={(e) => {
        if (image.dataUrl) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (image.dataUrl) return;
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void handleArtworkFile(file);
      }}
      style={{
        backgroundColor: '#2a2b30',
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.085) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        backgroundPosition: 'center center',
        outline: dragOver ? '2px solid rgba(124, 58, 237, 0.65)' : undefined,
        outlineOffset: -2,
      }}
    >
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: framePx,
          height: framePx,
          transform: `translate(-50%, -50%) translate(${panX}px, ${panY}px)`,
          cursor,
          touchAction: 'none',
          boxShadow: '0 26px 70px -22px rgba(0,0,0,0.85)',
        }}
        onPointerDown={onFramePointerDown}
        onDoubleClick={resetArtwork}
      >
        {isTransparent && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundColor: '#3a3b40',
              backgroundImage:
                'linear-gradient(45deg, #47484e 25%, transparent 25%), linear-gradient(-45deg, #47484e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #47484e 75%), linear-gradient(-45deg, transparent 75%, #47484e 75%)',
              backgroundSize: '18px 18px',
              backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0px',
              clipPath: getShapeClip(iconShape, framePx),
            }}
          />
        )}

        {/* The rendered icon already contains background, shape, artwork, filters and effects. */}
        {displayUrl && (
          <img
            src={displayUrl}
            alt="Icon preview"
            draggable={false}
            className="relative z-10 size-full object-contain pointer-events-none"
            onError={() => {
              if (previewUrl && !previewFailed) setPreviewFailed(true);
            }}
          />
        )}

        {!image.dataUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-[inherit] text-center transition-colors hover:bg-black/10"
          >
            <span className="flex size-20 items-center justify-center rounded-2xl border border-white/15 bg-black/35 shadow-xl backdrop-blur-sm">
              {uploading ? (
                <Loader2 className="size-8 animate-spin text-white" />
              ) : (
                <Plus className="size-9 text-white" />
              )}
            </span>
            <span className="text-sm font-medium text-white">
              {uploading ? 'Preparing artwork…' : 'Upload artwork'}
            </span>
            <span className="text-[11px] text-white/60">
              PNG, JPG, WebP or SVG · max 2048px
            </span>
            {uploadError && <span className="text-[11px] text-red-300">{uploadError}</span>}
          </button>
        )}

        {/* Frame outline */}
        <div className="absolute inset-0 z-20 pointer-events-none ring-1 ring-white/20" />

        {showGrid && image.dataUrl && (
          <svg className="absolute inset-0 z-20 size-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((v) => (
              <g key={v} stroke="rgba(255, 255, 255, 0.14)" strokeWidth="0.15">
                <line x1={v} y1={0} x2={v} y2={100} />
                <line x1={0} y1={v} x2={100} y2={v} />
              </g>
            ))}
          </svg>
        )}

        {safeArea.show && image.dataUrl && (
          <svg className="absolute inset-0 z-20 size-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {safeArea.android && (
              <circle cx="50" cy="50" r="33.33" fill="none" stroke="rgba(34, 197, 94, 0.7)" strokeWidth="0.4" strokeDasharray="1.6 1.2" />
            )}
            {safeArea.iOS && (
              <rect x="10" y="10" width="80" height="80" rx="18" fill="none" stroke="rgba(59, 130, 246, 0.65)" strokeWidth="0.4" strokeDasharray="1.6 1.2" />
            )}
            {safeArea.web && (
              <rect x="6" y="6" width="88" height="88" rx="2" fill="none" stroke="rgba(245, 158, 11, 0.65)" strokeWidth="0.35" strokeDasharray="1.2 1" />
            )}
          </svg>
        )}

        {crop.enabled && (
          <div className="absolute inset-0 z-30">
            {/* Dim the area outside the crop box (the box shadow leaves the crop area clear). */}
            <div
              className="absolute bg-transparent"
              style={{
                left: `${cropRect.x * 100}%`,
                top: `${cropRect.y * 100}%`,
                width: `${cropRect.w * 100}%`,
                height: `${cropRect.h * 100}%`,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.9)',
                cursor: 'move',
              }}
              onPointerDown={(e) => onCropPointerDown(e)}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
              </div>
              {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as CropHandle[]).map((handle) => {
                const style: React.CSSProperties = {
                  position: 'absolute',
                  width: 12,
                  height: 12,
                  background: '#fff',
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.4)',
                  cursor: `${handle}-resize`,
                  touchAction: 'none',
                };
                if (handle.includes('n')) style.top = -6;
                if (handle.includes('s')) style.bottom = -6;
                if (handle.includes('w')) style.left = -6;
                if (handle.includes('e')) style.right = -6;
                if (handle === 'n' || handle === 's') { style.left = 'calc(50% - 6px)'; }
                if (handle === 'e' || handle === 'w') { style.top = 'calc(50% - 6px)'; }
                return (
                  <div
                    key={handle}
                    style={style}
                    onPointerDown={(e) => onCropPointerDown(e, handle)}
                  />
                );
              })}
              {cropAr && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white/80">
                  {crop.aspectRatio}
                </div>
              )}
            </div>
          </div>
        )}

        {!crop.enabled && activeTool === 'select' && image.dataUrl && (
          <>
            {/* Rotate handle */}
            <div
              className="absolute left-1/2 z-30 -translate-x-1/2 -top-10 flex flex-col items-center"
              onPointerDown={onRotatePointerDown}
              style={{ cursor: 'grab' }}
            >
              <div className="size-4 rounded-full border-2 border-white bg-primary shadow" />
              <div className="h-5 w-px bg-white/70" />
            </div>
            {/* Scale handle */}
            <div
              className="absolute z-30 -bottom-2 -right-2 size-4 rounded-full border-2 border-white bg-primary shadow"
              onPointerDown={onScalePointerDown}
              style={{ cursor: 'nwse-resize' }}
              title="Drag to scale artwork"
            />
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        data-upload-input
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleArtworkFile(file);
          e.currentTarget.value = '';
        }}
      />

      <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-md border border-white/10 bg-[#17181c]/85 px-2 py-1 text-[10px] text-zinc-400 backdrop-blur sm:block">
        {image.dataUrl
          ? `${Math.round(zoom)}% · ${iconShape} · drag artwork to reposition`
          : 'Upload artwork to start'}
      </div>
    </div>
  );
});
