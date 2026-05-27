'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/store/useEditorStore';

interface Command {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
  icon: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const image = useEditorStore((s) => s.image);

  const commands: Command[] = [
    { id: 'upload', label: 'Upload Image', description: 'Upload a new app icon', shortcut: '⌘O', icon: '↑', action: () => document.querySelector<HTMLInputElement>('[data-upload-input]')?.click() },
    { id: 'export', label: 'Export Icons', description: 'Generate and download icon pack', shortcut: '⌘E', icon: '↓', action: () => useEditorStore.getState().setExportModalOpen(true) },
    { id: 'home', label: 'Go to Home', description: 'Return to the landing page', icon: '⌂', action: () => router.push('/') },
    { id: 'toggle-grid', label: 'Toggle Grid', description: 'Show/hide alignment grid', shortcut: '⌘G', icon: '⊞', action: () => useEditorStore.getState().toggleGrid() },
    { id: 'reset', label: 'Reset Editor', description: 'Clear canvas and start over', icon: '↺', action: () => { useEditorStore.getState().reset(); router.push('/'); } },
    { id: 'dark-mode', label: 'Toggle Dark Mode', description: 'Switch between dark and light themes', shortcut: '⌘⇧D', icon: '☽', action: () => {
      const root = document.documentElement;
      const isDark = root.classList.contains('dark');
      root.classList.toggle('dark', !isDark);
      root.classList.toggle('light', isDark);
      localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    }},
  ];

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const execute = useCallback((cmd: Command) => {
    setOpen(false);
    setQuery('');
    cmd.action();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIndex]) { execute(filtered[selectedIndex]); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="w-full max-w-lg rounded-xl border border-border/50 bg-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <svg className="size-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5">
              {filtered.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">No commands found</p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    i === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  <span className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-mono shrink-0">
                    {cmd.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cmd.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{cmd.description}</p>
                  </div>
                  {cmd.shortcut && (
                    <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0 font-mono">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
