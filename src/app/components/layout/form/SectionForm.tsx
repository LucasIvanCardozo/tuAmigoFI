'use client';

import type { ReactNode } from 'react';

interface SectionFormProps {
  title?: string;
  icon?: ReactNode;
  number?: number | string;
  children: ReactNode;
  className?: string;
}

export function SectionForm({
  title,
  icon,
  number,
  children,
  className = 'flex flex-col gap-2',
}: SectionFormProps) {
  return (
    <section className={className}>
      {(title || icon || number !== undefined) && (
        <header className="flex items-center gap-2">
          {icon}
          {number !== undefined && (
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#92C1C9] text-xs font-bold text-(--black)"
            >
              {number}
            </span>
          )}
          {title && <h3 className="text-base font-bold text-white">{title}</h3>}
        </header>
      )}
      {children}
    </section>
  );
}
