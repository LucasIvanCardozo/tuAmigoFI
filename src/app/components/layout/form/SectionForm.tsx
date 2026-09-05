'use client';

import type { ReactNode } from 'react';

interface SectionFormProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionForm({
  title,
  icon,
  children,
  className = 'flex flex-col gap-2',
}: SectionFormProps) {
  return (
    <section className={className}>
      {(title || icon) && (
        <header className="flex items-center gap-2">
          {icon}
          {title && <h4 className="text-white font-medium">{title}</h4>}
        </header>
      )}
      {children}
    </section>
  );
}
