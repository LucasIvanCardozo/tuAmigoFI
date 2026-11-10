'use client';

import { type ReactNode, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CgClose } from 'react-icons/cg';
import { type ModalContextPart, useModal } from '@/app/contexts/ModalContext';
import { useDialogA11y } from '@/app/hooks/useDialogA11y';

interface ModalProps {
  children: ReactNode;
  title?: string;
  context?: ModalContextPart[];
}

export const Modal = ({ children, title, context }: ModalProps) => {
  const { closeModal } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const hasContext = Boolean(context && context.length > 0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      dialog.show();
    }
  }, []);

  useDialogA11y(dialogRef, closeModal);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-800/50 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={closeModal}
        aria-label="Cerrar modal"
        tabIndex={-1}
      />
      <dialog
        ref={dialogRef}
        className="relative w-full max-w-lg m-0 p-0 bg-slate-800 text-white border-0 rounded-lg shadow-xl"
        aria-labelledby={title ? headingId : undefined}
        aria-label={title ? undefined : 'Modal'}
      >
        <div className="relative flex flex-col gap-3 p-5 max-h-[90dvh] overflow-y-auto">
          {(title || hasContext) && (
            <header className="flex flex-col gap-1 pr-10">
              {title && (
                <h2 id={headingId} className="text-lg font-bold text-white">
                  {title}
                </h2>
              )}
              {hasContext && (
                <p className="text-sm text-(--silver)">
                  {context?.map((part) =>
                    part.strong ? (
                      <strong key={part.text} className="font-semibold text-white">
                        {part.text}
                      </strong>
                    ) : (
                      <span key={part.text}>{part.text}</span>
                    ),
                  )}
                </p>
              )}
            </header>
          )}
          {children}
          <button
            type="button"
            className="absolute top-0 right-0 flex items-center justify-center w-10 h-10 p-2 cursor-pointer hover:bg-slate-700 rounded-tr-lg z-10"
            onClick={closeModal}
            aria-label="Cerrar"
          >
            <CgClose className="h-full w-full" />
          </button>
        </div>
      </dialog>
    </div>,
    document.getElementById('root') ?? document.body,
  );
};
