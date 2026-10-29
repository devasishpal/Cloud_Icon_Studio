'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Toolbar } from '@/components/editor/toolbar';
import { ToolCard } from '@/components/tool-card';
import { WorkspaceLayout } from '@/components/workspace-layout';
import { RightPanel } from '@/components/right-panel';
import { ExportModal } from '@/components/export/export-modal';
import { ErrorBoundary } from '@/components/error-boundary';
import { rehydrateStore } from '@/store/useEditorStore';
import { useKeyboardShortcuts } from '@/components/keyboard-shortcuts';
import { StatusBar } from '@/components/status-bar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const CommandPalette = dynamic(() => import('@/components/command-palette').then((m) => ({ default: m.CommandPalette })), { ssr: false });
const OfflineBanner = dynamic(() => import('@/components/offline-banner').then((m) => ({ default: m.OfflineBanner })), { ssr: false });

// Keep this markup deliberately small and stable. It is rendered on the server
// and on the client's first pass, so it must never depend on build-time state.
function EditorSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading editor"
      className="dark flex flex-1 flex-col overflow-hidden bg-[#26272c]"
    />
  );
}

export default function EditorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [mobileToolOpen, setMobileToolOpen] = useState(false);

  useKeyboardShortcuts();

  // Wait for IndexedDB before showing the workspace. A direct visit with no
  // saved artwork stays on the editor and shows the upload canvas.
  useEffect(() => {
    let alive = true;
    rehydrateStore().finally(() => {
      if (!alive) return;
      setIsMounted(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleMobilePreview = useCallback(() => {
    setMobilePreviewOpen(true);
  }, []);

  const handleMobileTool = useCallback(() => {
    setMobileToolOpen(true);
  }, []);

  const pageContent = !isMounted ? (
    <EditorSkeleton />
  ) : (
    <ErrorBoundary>
      <div className="dark flex flex-1 flex-col overflow-hidden bg-[#26272c] text-zinc-100">
        <OfflineBanner />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Toolbar
            onMobilePreview={handleMobilePreview}
            onMobileTool={handleMobileTool}
          />
          <div className="hidden md:flex">
            <ToolCard />
          </div>
          <WorkspaceLayout />
          <RightPanel />
        </div>
        <StatusBar />
        <ExportModal />
        <CommandPalette />

        <Sheet open={mobileToolOpen} onOpenChange={setMobileToolOpen}>
          <SheetContent
            side="left"
            className="w-72 p-0 md:hidden [&>[data-slot=sheet-close]]:top-3 [&>[data-slot=sheet-close]]:right-3"
            showCloseButton={true}
          >
            <ToolCard className="flex-1 flex flex-col overflow-hidden w-auto border-r-0" />
          </SheetContent>
        </Sheet>

        <Sheet open={mobilePreviewOpen} onOpenChange={setMobilePreviewOpen}>
          <SheetContent
            side="right"
            className="w-80 p-0 sm:max-w-sm [&>[data-slot=sheet-close]]:top-3 [&>[data-slot=sheet-close]]:right-3"
            showCloseButton={true}
          >
            <RightPanel className="flex flex-col overflow-hidden size-full" />
          </SheetContent>
        </Sheet>
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
