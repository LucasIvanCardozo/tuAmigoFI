'use client';

import type { FormHTMLAttributes, ReactNode } from 'react';

type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> & {
  children: ReactNode;
};

const baseClass = 'relative flex flex-col w-full';

export function Form({ children, className, ...props }: FormProps) {
  const classes = className ? `${baseClass} ${className}` : baseClass;
  return (
    <form {...props} className={classes}>
      {children}
    </form>
  );
}
