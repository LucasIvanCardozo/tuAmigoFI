'use client';

import { type RefObject, useEffect } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

export const useDialogA11y = (ref: RefObject<HTMLDialogElement | null>, onClose: () => void) => {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const focusables = (): HTMLElement[] =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled'),
      );

    const first = focusables()[0];
    first?.focus();

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (!firstItem || !lastItem) return;
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    dialog.addEventListener('keydown', onKeydown);
    return () => {
      dialog.removeEventListener('keydown', onKeydown);
    };
  }, [ref, onClose]);
};
