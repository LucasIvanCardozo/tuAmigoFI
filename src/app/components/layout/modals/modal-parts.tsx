import type { ReactNode } from 'react';
import {
  HiOutlineDocumentArrowUp,
  HiOutlineInformationCircle,
  HiOutlineScissors,
} from 'react-icons/hi2';

export const ModalNotice = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2 rounded-lg bg-(--midnight-green) p-3">
    <HiOutlineInformationCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
    <p className="text-xs font-medium text-(--silver)">{children}</p>
  </div>
);

export const ModalFileTools = () => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-wrap gap-2">
      <a
        href="https://www.ilovepdf.com/es/eliminar-paginas"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-700"
      >
        <HiOutlineScissors aria-hidden="true" className="h-4 w-4" />
        Eliminar páginas
      </a>
      <a
        href="https://tools.pdf24.org/es/convertidor-pdf"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-700"
      >
        <HiOutlineDocumentArrowUp aria-hidden="true" className="h-4 w-4" />
        Convertir a PDF
      </a>
    </div>
    <p className="text-xs text-(--silver)">iLovePDF y PDF24: se abren en otra pestaña.</p>
  </div>
);

export const ModalContactLine = () => (
  <p className="text-xs text-(--silver)">
    ¿Algún problema con la carga? Escribinos por WhatsApp:{' '}
    <a
      href="https://wa.me/+5492235319564"
      target="_blank"
      rel="noopener"
      className="font-semibold text-white underline"
    >
      2235319564
    </a>
  </p>
);
