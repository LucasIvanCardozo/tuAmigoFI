'use client';

import {
  type DocumentLoadEvent,
  ScrollMode,
  SpecialZoomLevel,
  Viewer,
  ViewMode,
  Worker,
} from '@react-pdf-viewer/core';
import { type ToolbarSlot, toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { useCallback, useMemo, useState } from 'react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const WORKER_URL = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export default function PdfViewerImpl({ url }: { url: string }) {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const handleDocumentLoad = useCallback(({ doc }: DocumentLoadEvent) => {
    doc.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      setAspectRatio(viewport.width / viewport.height);
    });
  }, []);

  const plugins = useMemo(() => [toolbarPluginInstance], [toolbarPluginInstance]);

  return (
    <Worker workerUrl={WORKER_URL}>
      <div className="flex flex-col w-full rounded-md overflow-hidden border border-slate-300 bg-white mx-auto">
        <Toolbar>
          {(slot: ToolbarSlot) => (
            <div className="flex items-center justify-center gap-3 border-b border-slate-300 bg-[#C8E0E4] px-3 py-2">
              <div className="flex items-center gap-1">
                <slot.GoToPreviousPage />
                <slot.GoToNextPage />
              </div>
              <span className="text-xs text-slate-700 tabular-nums">
                <slot.CurrentPageLabel /> / <slot.NumberOfPages />
              </span>
              <div className="w-px h-5 bg-slate-400" />
              <div className="flex items-center gap-1">
                <slot.ZoomOut />
                <slot.CurrentScale />
                <slot.ZoomIn />
              </div>
            </div>
          )}
        </Toolbar>
        <div
          className="w-full flex-none"
          style={aspectRatio ? { aspectRatio } : { height: '75vh' }}
        >
          <Viewer
            fileUrl={url}
            plugins={plugins}
            defaultScale={SpecialZoomLevel.PageWidth}
            viewMode={ViewMode.SinglePage}
            scrollMode={ScrollMode.Page}
            onDocumentLoad={handleDocumentLoad}
            transformGetDocumentParams={(options) => ({
              ...options,
              isEvalSupported: false,
              enableScripting: false,
            })}
          />
        </div>
      </div>
    </Worker>
  );
}
