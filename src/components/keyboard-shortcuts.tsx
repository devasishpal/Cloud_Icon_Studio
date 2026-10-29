'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { normalizeUpload } from '@/lib/image-ops';
import { loadImageElement } from '@/lib/render';
import { MAX_FILE_SIZE, ZOOM_MAX, ZOOM_MIN } from '@/lib/constants';

function isTypingTarget(target: EventTarget | null): boolean {
  // Keyboard events can be dispatched on window/document (for example the
  // command-palette button does this), and those targets have no tagName or
  // getAttribute. Only inspect real DOM elements.
  if (!(target instanceof Element)) return false;
  const el = target as HTMLElement;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable ||
    el.getAttribute('role') === 'textbox'
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function openImagePicker() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/webp,image/svg+xml';
  input.style.display = 'none';
  document.body.appendChild(input);

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    input.remove();
    if (!file || file.size > MAX_FILE_SIZE) return;

    try {
      const dataUrl = await readFile(file);
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
      // Ignore unreadable files – the current image stays intact.
    }
  });

  input.click();
}

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const state = useEditorStore.getState();
      const meta = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isTypingTarget(e.target)) {
        if (key === 'escape') (e.target as HTMLElement).blur();
        return;
      }

      // ---- File / export -------------------------------------------------
      if (meta && key === 'o') {
        e.preventDefault();
        openImagePicker();
        return;
      }
      if (meta && key === 'e') {
        e.preventDefault();
        if (state.image.dataUrl) state.setExportModalOpen(true);
        return;
      }

      // ---- History -------------------------------------------------------
      if (meta && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        state.undo();
        return;
      }
      if ((meta && key === 'z' && e.shiftKey) || (meta && key === 'y')) {
        e.preventDefault();
        state.redo();
        return;
      }

      // ---- View ----------------------------------------------------------
      if (meta && key === 'g') {
        e.preventDefault();
        state.toggleGrid();
        return;
      }
      if (meta && key === '0') {
        e.preventDefault();
        state.resetView();
        return;
      }
      if (key === 'escape') {
        if (state.modalOpen) {
          state.setExportModalOpen(false);
          return;
        }
        if (state.crop.enabled) {
          state.setCrop({ enabled: false });
          state.setActiveTool('select');
          return;
        }
        state.setActiveTool('select');
        return;
      }
      if (key === '+' || key === '=') {
        e.preventDefault();
        state.setZoom(Math.min(ZOOM_MAX, state.zoom + 10));
        return;
      }
      if (key === '-' || key === '_') {
        e.preventDefault();
        state.setZoom(Math.max(ZOOM_MIN, state.zoom - 10));
        return;
      }

      // ---- Tools (single keys, only when an image is loaded) -------------
      if (!state.image.dataUrl || meta || e.altKey) return;

      const tools: Record<string, Parameters<typeof state.setActiveTool>[0]> = {
        v: 'select',
        h: 'pan',
        c: 'crop',
        r: 'rotate',
        b: 'background',
        a: 'adjust',
        e: 'effects',
        p: 'padding',
        s: 'shape',
      };

      if (tools[key]) {
        e.preventDefault();
        const tool = tools[key];
        if (tool === 'crop') {
          state.setCrop({ enabled: !state.crop.enabled });
          state.setActiveTool(state.crop.enabled ? 'select' : 'crop');
        } else {
          state.setActiveTool(tool);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
