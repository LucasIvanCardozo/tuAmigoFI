'use client';

import dynamic from 'next/dynamic';
import { MdDownload } from 'react-icons/md';

const PdfViewer = dynamic(() => import('./pdf-viewer-impl'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[750px] bg-[#C8E0E4] rounded-md text-sm text-slate-600">
      Cargando visor de PDF...
    </div>
  ),
});

export default function PdfView({ url }: { url: string }) {
  if (!url) {
    return (
      <div className="flex items-center justify-center w-full h-[750px] bg-[#C8E0E4] rounded-md text-sm text-slate-600">
        PDF no disponible.
      </div>
    );
  }

  return (
    <div className="relative">
      <PdfViewer url={url} />
      <a
        href={url}
        download="Tu-Amigo-FI.pdf"
        className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center bg-white/65 rounded-md hover:bg-white"
        aria-label="Descargar PDF"
        title="Descargar PDF"
      >
        <MdDownload className="h-full w-full" />
      </a>
    </div>
  );
}
