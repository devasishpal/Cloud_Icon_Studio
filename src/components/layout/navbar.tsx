'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Undo2, Redo2, Download, ArrowLeft, Command, Menu, X, ZoomIn } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Platforms', href: '#platforms' },
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '/how-it-works' },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const router = useRouter();
  const isEditor = pathname === '/editor';
  const hasImage = useEditorStore((s) => s.image.dataUrl !== null);
  const setExportModalOpen = useEditorStore((s) => s.setExportModalOpen);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      if (pathname === '/') {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/' + href);
      }
    } else {
      router.push(href);
    }
  };

  const handleLaunchEditor = () => {
    setMobileOpen(false);
    if (pathname === '/') {
      const el = document.querySelector('#upload-area');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      router.push('/editor');
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          {isEditor && (
            <Link
              href="/"
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Back to home"
            >
              <ArrowLeft className="size-4" />
            </Link>
          )}
          <Link href={isEditor ? '/editor' : '/'} className="flex items-center gap-2.5 group" aria-label="CloudIcon Studio">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors overflow-hidden">
              <Image src="/icon.png" alt="CloudIcon" width={36} height={36} className="object-contain shrink-0" />
            </div>
            <span className="hidden sm:inline">
              {isEditor ? (
                <span className="text-base font-semibold tracking-tight">Icon Editor</span>
              ) : (
                <span className="text-lg font-extrabold tracking-wide" style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  CloudIcon Studio
                </span>
              )}
            </span>
            <span className="text-lg font-extrabold tracking-wide sm:hidden" style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              CloudIcon
            </span>
          </Link>
        </div>

        {!isEditor && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1">
          {isEditor && mounted && hasImage && (
            <>
              <button
                onClick={undo}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                aria-label="Undo"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="size-4" />
              </button>
              <button
                onClick={redo}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                aria-label="Redo"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="size-4" />
              </button>
              <div className="h-5 w-px bg-border/50 mx-1" />
              <button
                onClick={() => useEditorStore.getState().setRotation(0)}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                aria-label="Reset rotation"
                title="Reset rotation"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                onClick={() => useEditorStore.getState().setZoom(100)}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                aria-label="Reset zoom"
                title="Reset view"
              >
                <ZoomIn className="size-4" />
              </button>
              <div className="h-5 w-px bg-border/50 mx-1" />
              <Button
                size="sm"
                variant="default"
                className="h-8 text-xs gap-1.5 rounded-lg hidden sm:flex"
                onClick={() => setExportModalOpen(true)}
                aria-label="Export icons"
              >
                <Download className="size-3.5" />
                Generate & Download
              </Button>
              <Button
                size="icon"
                variant="default"
                className="size-8 rounded-lg sm:hidden"
                onClick={() => setExportModalOpen(true)}
                aria-label="Export icons"
              >
                <Download className="size-4" />
              </Button>
            </>
          )}
          {isEditor && (
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { metaKey: true, shiftKey: true, key: 'p' });
                window.dispatchEvent(event);
              }}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all hidden sm:flex"
              aria-label="Command palette"
              title="Command Palette (Ctrl+Shift+P)"
            >
              <Command className="size-4" />
            </button>
          )}
          {!isEditor && (
            <button
              onClick={handleLaunchEditor}
              className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-white shadow-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Download className="size-3.5" />
              Launch Editor
            </button>
          )}
          <ThemeToggle />
          {!isEditor && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          )}
        </div>
      </div>

      {!isEditor && mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleLaunchEditor}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all mt-2"
            style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Download className="size-3.5" />
            Launch Editor
          </button>
        </div>
      )}
    </header>
  );
}
