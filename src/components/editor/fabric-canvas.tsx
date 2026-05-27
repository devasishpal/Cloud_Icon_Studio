'use client';

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '@/store/useEditorStore';

const CANVAS_BG = '#555555';

interface GridObject extends fabric.FabricObject {
  data?: { type: string };
}

interface BgObject extends fabric.FabricObject {
  data?: { type: string };
}

export interface FabricCanvasHandle {
  applyCrop: () => void;
}

export const FabricCanvas = forwardRef<FabricCanvasHandle, {}>(function FabricCanvas(props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const imageRef = useRef<fabric.Image | null>(null);
  const bgRectRef = useRef<BgObject | null>(null);
  const cropRectRef = useRef<fabric.Rect | null>(null);
  const isCreatingCropRef = useRef(false);
  const loadIdRef = useRef(0);

  const image = useEditorStore((s) => s.image);
  const zoom = useEditorStore((s) => s.zoom);
  const rotation = useEditorStore((s) => s.rotation);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const gradientPreset = useEditorStore((s) => s.gradientPreset);
  const showGrid = useEditorStore((s) => s.showGrid);
  const padding = useEditorStore((s) => s.padding);
  const crop = useEditorStore((s) => s.crop);
  const activeTool = useEditorStore((s) => s.activeTool);
  const iconShape = useEditorStore((s) => s.previewPreferences.iconShape);
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const setImage = useEditorStore((s) => s.setImage);

  const createShapeClipPath = useCallback((shape: string, w: number, h: number) => {
    const cx = w / 2, cy = h / 2;
    const d = Math.min(w, h), r = d / 2;
    switch (shape) {
      case 'circle': {
        const cr = Math.min(cx, cy);
        const e = new fabric.Ellipse({ rx: cr, ry: cr, left: cx - cr, top: cy - cr });
        e.set({ evented: false, selectable: false }); return e;
      }
      case 'squircle': {
        const rr = d * 0.3;
        const rect = new fabric.Rect({ left: 0, top: 0, width: w, height: h, rx: rr, ry: rr });
        rect.set({ evented: false, selectable: false }); return rect;
      }
      case 'rounded-square': {
        const rr = d * 0.22;
        const rect = new fabric.Rect({ left: 0, top: 0, width: w, height: h, rx: rr, ry: rr });
        rect.set({ evented: false, selectable: false }); return rect;
      }
      case 'teardrop': {
        const p = `M ${cx} ${h} C ${w} ${h}, ${w} ${cy + r * 0.3}, ${w} ${cy} C ${w} ${cy * 0.2}, ${cx + r * 0.8} ${cy - r}, ${cx} ${cy - r} C ${cx - r * 0.8} ${cy - r}, ${0} ${cy * 0.2}, ${0} ${cy} C ${0} ${cy + r * 0.3}, ${0} ${h}, ${cx} ${h} Z`;
        const path = new fabric.Path(p, { left: 0, top: 0 });
        path.set({ evented: false, selectable: false }); return path;
      }
      default: return null;
    }
  }, []);

  const drawGridFn = useCallback((canvas: fabric.Canvas, show: boolean) => {
    const existing = canvas.getObjects().filter(
      (obj) => (obj as GridObject).data?.type === 'grid-line'
    );
    existing.forEach((obj) => canvas.remove(obj));

    if (!show) { canvas.requestRenderAll(); return; }

    const w = canvas.getWidth();
    const h = canvas.getHeight();
    const step = 50;

    for (let x = 0; x <= w; x += step) {
      const line = new fabric.Line([x, 0, x, h], {
        stroke: 'rgba(139, 92, 246, 0.15)', strokeWidth: 1,
        selectable: false, evented: false,
      }) as GridObject;
      line.data = { type: 'grid-line' };
      canvas.add(line);
    }
    for (let y = 0; y <= h; y += step) {
      const line = new fabric.Line([0, y, w, y], {
        stroke: 'rgba(139, 92, 246, 0.15)', strokeWidth: 1,
        selectable: false, evented: false,
      }) as GridObject;
      line.data = { type: 'grid-line' };
      canvas.add(line);
    }

    const cx = w / 2, cy = h / 2;
    [line(0, cy, w, cy, 'rgba(139, 92, 246, 0.3)', [5, 5]),
     line(cx, 0, cx, h, 'rgba(139, 92, 246, 0.3)', [5, 5])].forEach((l) => canvas.add(l));

    canvas.renderAll();
  }, []);

  const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, dash?: number[]) => {
    const l = new fabric.Line([x1, y1, x2, y2], {
      stroke, strokeWidth: 1, selectable: false, evented: false,
      strokeDashArray: dash,
    }) as GridObject;
    l.data = { type: 'grid-line' };
    return l;
  };

  const createShapeClipPathRef = useRef(createShapeClipPath);
  createShapeClipPathRef.current = createShapeClipPath;

  const updateBgFillRect = useCallback((canvas: fabric.Canvas, img: fabric.Image) => {
    if (backgroundType === 'transparent') {
      if (bgRectRef.current) {
        canvas.remove(bgRectRef.current);
        bgRectRef.current = null;
      }
      canvas.requestRenderAll();
      return;
    }

    let fill: string | fabric.Gradient<'linear', 'linear'> = backgroundColor;
    if (backgroundType === 'gradient' && gradientPreset) {
      const angle = gradientPreset.angle;
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad), sin = Math.sin(rad);
      fill = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0.5 - cos * 0.5, y1: 0.5 - sin * 0.5,
          x2: 0.5 + cos * 0.5, y2: 0.5 + sin * 0.5,
        },
        colorStops: [
          { offset: 0, color: gradientPreset.colors[0] },
          { offset: 1, color: gradientPreset.colors[1] },
        ],
      });
    }

    if (bgRectRef.current) {
      bgRectRef.current.set({
        left: img.left, top: img.top,
        width: img.width, height: img.height,
        scaleX: img.scaleX, scaleY: img.scaleY,
        angle: img.angle,
        fill,
      });
      bgRectRef.current.dirty = true;
    } else {
      const rect = new fabric.Rect({
        left: img.left, top: img.top,
        width: img.width, height: img.height,
        scaleX: img.scaleX, scaleY: img.scaleY,
        originX: 'center', originY: 'center',
        fill, selectable: false, evented: false,
      }) as BgObject;
      rect.data = { type: 'bg' };
      canvas.add(rect);
      canvas.sendObjectToBack(rect);
      bgRectRef.current = rect;
    }
    const bgClip = createShapeClipPathRef.current(iconShape, img.width!, img.height!);
    if (bgRectRef.current) {
      bgRectRef.current.set({ clipPath: bgClip });
      bgRectRef.current.dirty = true;
    }
    canvas.requestRenderAll();
  }, [backgroundColor, backgroundType, gradientPreset, iconShape]);

  const updateBgFillRectRef = useRef(updateBgFillRect);
  updateBgFillRectRef.current = updateBgFillRect;

  const setBackground = useCallback((canvas: fabric.Canvas, img?: fabric.Image | null) => {
    canvas.backgroundColor = CANVAS_BG;
    const target = img !== undefined ? img : imageRef.current;
    if (target) {
      updateBgFillRectRef.current(canvas, target);
    } else if (bgRectRef.current) {
      canvas.remove(bgRectRef.current);
      bgRectRef.current = null;
      canvas.requestRenderAll();
    } else {
      canvas.requestRenderAll();
    }
  }, []);

  const setBackgroundRef = useRef(setBackground);
  setBackgroundRef.current = setBackground;

  const loadImageToCanvasRef = useRef<(canvas: fabric.Canvas, url: string) => void>(() => {});
  loadImageToCanvasRef.current = (canvas: fabric.Canvas, url: string) => {
    const imgEl = new window.Image();
    imgEl.crossOrigin = 'anonymous';
    const loadId = ++loadIdRef.current;
    imgEl.onload = () => {
      if (fabricRef.current !== canvas || loadIdRef.current !== loadId) return;
      const cw = canvas.getWidth(), ch = canvas.getHeight();
      const scale = Math.min((cw * 0.6) / imgEl.naturalWidth, (ch * 0.6) / imgEl.naturalHeight);
      const currentTool = useEditorStore.getState().activeTool;
      const isSelect = currentTool === 'select';
      const img = new fabric.FabricImage(imgEl, {
        left: cw / 2, top: ch / 2,
        originX: 'center', originY: 'center',
        scaleX: scale, scaleY: scale,
        selectable: isSelect, evented: isSelect,
      });
      (img as any).__originalScale = scale;
      try {
        canvas.getObjects().forEach((obj) => {
          if ((obj as any)?.data?.type !== 'grid-line' && (obj as any)?.data?.type !== 'bg') canvas.remove(obj);
        });
        canvas.add(img);
        setBackgroundRef.current(canvas, img);
      } catch {}
      imageRef.current = img;
    };
    imgEl.src = url;
  };

  const initCanvas = useCallback(() => {
    if (!canvasRef.current || fabricRef.current) return;
    const parent = canvasRef.current.parentElement;
    if (!parent) return;
    const width = parent.clientWidth || 800;
    const height = parent.clientHeight || 600;

    const ctx = canvasRef.current.getContext('2d', {
      alpha: true,
      willReadFrequently: false,
      desynchronized: true,
    });

    const canvas = new fabric.Canvas(canvasRef.current, {
      width, height,
      backgroundColor: CANVAS_BG,
      selection: false,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      stopContextMenu: true,
      renderOnAddRemove: false,
      skipTargetFind: true,
      imageSmoothingEnabled: true,
    });

    canvas.setZoom(1);
    fabricRef.current = canvas;
    setCanvasSize(width, height);

    if (image.dataUrl) loadImageToCanvasRef.current(canvas, image.dataUrl);

    let animId: number;
    const loop = () => {
      const img = imageRef.current;
      if (bgRectRef.current && img) {
        if (
          bgRectRef.current.left !== img.left ||
          bgRectRef.current.top !== img.top
        ) {
          bgRectRef.current.set({ left: img.left, top: img.top });
          bgRectRef.current.dirty = true;
        }
      }
      canvas.renderAll();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [image.dataUrl, setCanvasSize]);

  useEffect(() => {
    const cleanup = initCanvas();
    return () => cleanup?.();
  }, [initCanvas]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    const center = new fabric.Point(c.getWidth() / 2, c.getHeight() / 2);
    c.zoomToPoint(center, zoom / 100);
    c.requestRenderAll();
  }, [zoom]);

  useEffect(() => {
    const img = imageRef.current;
    const c = fabricRef.current;
    if (!img) return;
    img.set('angle', rotation);
    img.dirty = true;
    if (bgRectRef.current) {
      bgRectRef.current.set({ angle: rotation });
      bgRectRef.current.dirty = true;
    }
    (c || img.canvas)?.requestRenderAll();
  }, [rotation]);

  useEffect(() => {
    const c = fabricRef.current;
    const img = imageRef.current;
    const sel = activeTool === 'select';
    const canFind = activeTool === 'select' || activeTool === 'crop';
    if (img) img.set({ selectable: sel, evented: sel });
    if (c) {
      c.selection = sel;
      c.skipTargetFind = !canFind;
      c.defaultCursor = canFind ? 'default' : 'crosshair';
      c.requestRenderAll();
    }
  }, [activeTool]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    const vpt = c.viewportTransform;
    if (vpt) { vpt[4] = panX; vpt[5] = panY; c.requestRenderAll(); }
  }, [panX, panY]);

  useEffect(() => {
    const c = fabricRef.current;
    const img = imageRef.current;
    if (!c) return;
    setBackground(c, img ?? null);
  }, [backgroundColor, backgroundType, gradientPreset, setBackground]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    drawGridFn(c, showGrid);
  }, [showGrid, drawGridFn]);

  useEffect(() => {
    const img = imageRef.current;
    const c = fabricRef.current;
    if (!img || !c) return;
    const original = (img as any).__originalScale;
    if (original == null) return;
    const ratio = 1 - padding / 100;
    img.set({ scaleX: original * ratio, scaleY: original * ratio });
    img.dirty = true;
    if (bgRectRef.current) {
      updateBgFillRect(c, img);
    } else {
      c.requestRenderAll();
    }
  }, [padding, updateBgFillRect]);

  useEffect(() => {
    const img = imageRef.current;
    const c = fabricRef.current;
    if (!img) return;
    const w = img.width;
    const h = img.height;
    if (!w || !h) return;
    const clip = createShapeClipPath(iconShape, w, h);
    img.set({ clipPath: clip });
    img.dirty = true;
    if (bgRectRef.current && c) {
      updateBgFillRect(c, img);
    } else {
      img.canvas?.requestRenderAll();
    }
  }, [iconShape, createShapeClipPath, updateBgFillRect]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !imageRef.current) return;

    if (crop.enabled) {
      const el = c.getElement();
      el.style.touchAction = 'none';

      const makeInteractive = (rect: fabric.Rect) => {
        rect.set({
          selectable: true, evented: true,
          hasControls: true, hasBorders: true,
          lockRotation: true,
        });
        c.setActiveObject(rect);
        c.renderAll();
      };

      const onMouseDown = (e: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        if (cropRectRef.current) return;
        const pointer = e.scenePoint || { x: 0, y: 0 };
        isCreatingCropRef.current = true;
        const rect = new fabric.Rect({
          left: pointer.x, top: pointer.y,
          width: 2, height: 2,
          fill: 'transparent', stroke: '#215ee9',
          strokeWidth: 2, strokeUniform: true,
          strokeDashArray: [6, 4],
          cornerSize: 10, cornerColor: '#215ee9',
          cornerStrokeColor: '#fff',
          transparentCorners: false, cornerStyle: 'circle',
          selectable: false, evented: false,
          hasControls: false, hasBorders: false,
        });
        c.add(rect);
        cropRectRef.current = rect;
        c.renderAll();
      };

      const onMouseMove = (e: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        if (!isCreatingCropRef.current || !cropRectRef.current) return;
        const pointer = e.scenePoint || { x: 0, y: 0 };
        const rect = cropRectRef.current;

        if (crop.aspectRatio !== 'free') {
          const ratios: Record<string, number> = { '1:1': 1, '4:3': 4 / 3, '16:9': 16 / 9 };
          const ar = ratios[crop.aspectRatio] || null;
          if (ar) {
            const dx = pointer.x - rect.left!;
            const dy = pointer.y - rect.top!;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            const signX = Math.sign(dx) || 1;
            const signY = Math.sign(dy) || 1;
            const w = Math.max(absDx, absDy * ar);
            const h = w / ar;
            rect.set({
              width: w * signX, height: h * signY,
              left: dx > 0 ? rect.left! : rect.left! + w * signX,
              top: dy > 0 ? rect.top! : rect.top! + h * signY,
            });
            c.renderAll();
            return;
          }
        }

        const l = Math.min(rect.left!, pointer.x);
        const t = Math.min(rect.top!, pointer.y);
        const w = Math.abs(pointer.x - rect.left!);
        const h = Math.abs(pointer.y - rect.top!);
        rect.set({ left: l, top: t, width: w, height: h });
        c.renderAll();
      };

      const onMouseUp = () => {
        if (!isCreatingCropRef.current || !cropRectRef.current) return;
        isCreatingCropRef.current = false;
        const rect = cropRectRef.current;
        if (rect.width! < 5 || rect.height! < 5) {
          c.remove(rect);
          cropRectRef.current = null;
          c.renderAll();
          return;
        }
        makeInteractive(rect);
      };

      c.on('mouse:down', onMouseDown);
      c.on('mouse:move', onMouseMove);
      c.on('mouse:up', onMouseUp);

      return () => {
        el.style.touchAction = '';
        c.off('mouse:down', onMouseDown);
        c.off('mouse:move', onMouseMove);
        c.off('mouse:up', onMouseUp);
      };
    } else {
      if (cropRectRef.current) {
        c.remove(cropRectRef.current);
        cropRectRef.current = null;
        c.renderAll();
      }
    }
  }, [crop.enabled, crop.aspectRatio]);

  useEffect(() => {
    const rect = cropRectRef.current;
    if (!rect || !rect.canvas || crop.aspectRatio === 'free') return;
    const ratios: Record<string, number> = { '1:1': 1, '4:3': 4 / 3, '16:9': 16 / 9 };
    const ratio = ratios[crop.aspectRatio] || 1;
    const rh = rect.height!;
    rect.set('width', rh * ratio);
    rect.canvas.renderAll();
  }, [crop.aspectRatio]);

  const applyCrop = useCallback(() => {
    const rect = cropRectRef.current;
    const img = imageRef.current;
    if (!rect || !img || !img.canvas) return;
    const bounds = rect.getBoundingRect();
    const imgBounds = img.getBoundingRect();
    const relLeft = (bounds.left - imgBounds.left) / img.scaleX!;
    const relTop = (bounds.top - imgBounds.top) / img.scaleY!;
    const relW = bounds.width / img.scaleX!;
    const relH = bounds.height / img.scaleY!;
    const src = img.getSrc();
    const tempImg = new window.Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.onload = () => {
      const tc = document.createElement('canvas');
      tc.width = relW; tc.height = relH;
      tc.getContext('2d')!.drawImage(tempImg, relLeft, relTop, relW, relH, 0, 0, relW, relH);
      setImage({ file: image.file, dataUrl: tc.toDataURL('image/png'), width: relW, height: relH });
    };
    tempImg.src = src;
  }, [setImage, image.file]);

  useImperativeHandle(ref, () => ({ applyCrop }), [applyCrop]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && crop.enabled) applyCrop();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [crop.enabled, applyCrop]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    let rafId: number;
    const resize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const parent = canvasRef.current?.parentElement;
        const canvas = fabricRef.current;
        if (!parent || !canvas || canvas.disposed) return;
        const w = parent.clientWidth || 800;
        const h = parent.clientHeight || 600;
        canvas.setDimensions({ width: w, height: h });
        setCanvasSize(w, h);
        setBackgroundRef.current(canvas);
      });
    };
    const observer = new ResizeObserver(resize);
    const parent = canvasRef.current?.parentElement;
    if (parent) observer.observe(parent);
    return () => { cancelAnimationFrame(rafId); observer.disconnect(); };
  }, [setCanvasSize]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      useEditorStore.getState().setZoom(
        Math.max(10, Math.min(500, useEditorStore.getState().zoom + delta))
      );
    }
  }, []);

  const isTransparent = backgroundType === 'transparent';

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={
        isTransparent
          ? {
              backgroundColor: '#666666',
              backgroundImage:
                `linear-gradient(45deg, #555555 25%, transparent 25%), linear-gradient(-45deg, #555555 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #555555 75%), linear-gradient(-45deg, transparent 75%, #555555 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }
          : {}
      }
    >
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
});
