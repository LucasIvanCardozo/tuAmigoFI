'use client';

import type { ChangeEvent, FormHTMLAttributes, ReactNode, Ref } from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> & {
  children: ReactNode;
};

const baseClass = 'relative flex flex-col w-full gap-4';

export const inputClass =
  'w-full rounded-md border border-slate-700 bg-(--white) px-3 py-2 text-sm text-(--black) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92C1C9]';

export function Form({ children, className, ...props }: FormProps) {
  const classes = className ? `${baseClass} ${className}` : baseClass;
  return (
    <form {...props} className={classes}>
      {children}
    </form>
  );
}

export function fieldDescribedBy(helperId?: string, errorId?: string) {
  const ids = [helperId, errorId].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

interface FieldLabelProps {
  id: string;
  label?: string;
  required?: boolean;
}

export function FieldLabel({ id, label, required }: FieldLabelProps) {
  if (!label) return null;
  return (
    <label htmlFor={id} className="text-sm font-medium text-white">
      {label}
      {required && (
        <>
          <span aria-hidden="true" className="text-[#92C1C9]">
            {' '}
            *
          </span>
          <span className="sr-only"> (obligatorio)</span>
        </>
      )}
    </label>
  );
}

export function FieldHelper({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="text-xs text-(--silver)">
      {children}
    </p>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-2 text-sm font-medium text-red-400">
      <HiOutlineExclamationTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

interface FileRowProps {
  id: string;
  state: string;
  invalid?: boolean;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  describedBy?: string;
  inputRef?: Ref<HTMLInputElement>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export function FileRow({
  id,
  state,
  invalid = false,
  accept,
  required,
  disabled,
  buttonLabel = 'Elegir archivo',
  describedBy: ariaDescribedBy,
  inputRef,
  onChange,
  onBlur,
}: FileRowProps) {
  return (
    <>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        className="peer sr-only"
      />
      <span
        className={`flex items-center gap-2 rounded-md border bg-(--white) p-2 ${
          invalid ? 'border-red-400' : 'border-slate-700'
        } peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#92C1C9]`}
      >
        <label
          htmlFor={id}
          className="inline-flex shrink-0 cursor-pointer items-center rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white"
        >
          {buttonLabel}
        </label>
        <span className="min-w-0 flex-1 truncate text-sm text-(--black)">{state}</span>
      </span>
    </>
  );
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1).replace('.', ',')} KB`;
  return `${(kilobytes / 1024).toFixed(1).replace('.', ',')} MB`;
}
