'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Toolbar } from '@/components/editor/toolbar';
import { ToolCard } from '@/components/tool-card';
import { WorkspaceLayout } from '@/components/workspace-layout';
import { RightPanel } from '@/components/right-panel';
import { ExportModal } from '@/components/export/export-modal';
import { ErrorBoundary } from '@/components/error-boundary';
import { MobileBottomBar } from '@/components/mobile-bottom-bar';
import { useEditorStore, rehydrateStore } from '@/store/useEditorStore';
import { useUndoStore } from '@/store/undo-store';
import { useKeyboardShortcuts } from '@/components/keyboard-shortcuts';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBar } from '@/components/status-bar';

const CommandPalette = dynamic(() => import('@/components/command-palette').then((m) => ({ default: m.CommandPalette })), { ssr: false });
const InstallPwaPrompt = dynamic(() => import('@/components/install-pwa-prompt').then((m) => ({ default: m.InstallPwaPrompt })), { ssr: false });
const OfflineBanner = dynamic(() => import('@/components/offline-banner').then((m) => ({ default: m.OfflineBanner })), { ssr: false });

function EditorSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w-10 border-r border-border/50" />
        <div className="flex-1 bg-[#0a0a0c]" />
        <div className="hidden lg:flex lg:w-60 xl:w-72 border-l border-border/50" />
      </div>
    </div>
  );
}

export default function EditorPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const hasImage = useEditorStore((s) => s.image.dataUrl !== null);
  const isReady = useRef(false);

  useKeyboardShortcuts();

  useEffect(() => {
    rehydrateStore();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !hasImage && isReady.current) {
      router.replace('/');
    }
    isReady.current = true;
  }, [hasImage, router, isMounted]);

  useEffect(() => {
    const unsub = useEditorStore.subscribe((state, prev) => {
      const changed =
        state.padding !== prev.padding ||
        state.rotation !== prev.rotation ||
        state.zoom !== prev.zoom ||
        state.backgroundColor !== prev.backgroundColor ||
        state.backgroundType !== prev.backgroundType ||
        state.gradientPreset !== prev.gradientPreset ||
        state.showGrid !== prev.showGrid ||
        state.previewPreferences.iconShape !== prev.previewPreferences.iconShape;
      if (changed) {
        useUndoStore.getState().pushSnapshot({
          padding: state.padding,
          rotation: state.rotation,
          zoom: state.zoom,
          backgroundColor: state.backgroundColor,
          backgroundType: state.backgroundType,
          gradientPreset: state.gradientPreset,
          showGrid: state.showGrid,
          iconShape: state.previewPreferences.iconShape,
        });
      }
    });
    return unsub;
  }, []);

  const pageContent = !isMounted ? (
    <EditorSkeleton />
  ) : !hasImage ? (
    <div className="flex size-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  ) : (
    <ErrorBoundary>
      <div className="flex flex-col overflow-hidden h-full">
        <OfflineBanner />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Toolbar />
          <ToolCard />
          <WorkspaceLayout />
          <RightPanel />
        </div>
        <StatusBar />
        <MobileBottomBar />
        <ExportModal />
        <CommandPalette />
        <InstallPwaPrompt />
      </div>
    </ErrorBoundary>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: 'html,body{overflow:hidden!important;height:100dvh!important}' }} />
      {pageContent}
    </>
  );
}
