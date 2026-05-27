'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';

export function useKeyboardShortcuts() {
  const setExportModalOpen = useEditorStore((s) => s.setExportModalOpen);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key === 'o') { e.preventDefault(); document.querySelector<HTMLInputElement>('[data-upload-input]')?.click(); }
      if (meta && e.key === 'e') { e.preventDefault(); setExportModalOpen(true); }
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (meta && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if (meta && e.key === 'y') { e.preventDefault(); redo(); }
      if (meta && e.key === 'g') { e.preventDefault(); toggleGrid(); }
      if (e.key === 'Escape') { setActiveTool('select'); }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setExportModalOpen, toggleGrid, setActiveTool, undo, redo]);
}
