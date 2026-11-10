'use client';

import type { ReactNode, Ref } from 'react';
import { useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
  FieldError,
  FieldHelper,
  FieldLabel,
  FileRow,
  fieldDescribedBy,
  formatFileSize,
} from './form';

interface FileFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  helper?: ReactNode;
}

export function FileForm<T extends FieldValues>({
  name,
  control,
  label,
  accept,
  required,
  disabled,
  helper,
}: FileFormProps<T>) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { value, onChange, onBlur, ref } = field as {
          value: File | undefined;
          onChange: (v: File | undefined) => void;
          onBlur: () => void;
          ref: Ref<HTMLInputElement>;
        };
        const error = fieldState.error?.message;
        const state =
          value instanceof File
            ? `${value.name} · ${formatFileSize(value.size)}`
            : 'Ningún archivo seleccionado';

        return (
          <div className="flex flex-col gap-1">
            <FieldLabel id={id} label={label} required={required} />
            <FileRow
              id={id}
              inputRef={ref}
              accept={accept}
              required={required}
              disabled={disabled}
              invalid={Boolean(error)}
              state={state}
              describedBy={fieldDescribedBy(
                helper ? helperId : undefined,
                error ? errorId : undefined,
              )}
              onBlur={onBlur}
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file ?? undefined);
              }}
            />
            <FieldHelper id={helperId}>{helper}</FieldHelper>
            <FieldError id={errorId} message={error} />
          </div>
        );
      }}
    />
  );
}
