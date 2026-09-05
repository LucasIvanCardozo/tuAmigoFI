'use client';

import type { Ref } from 'react';
import { useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface FileFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FileForm<T extends FieldValues>({
  name,
  control,
  label,
  accept,
  required,
  disabled,
}: FileFormProps<T>) {
  const id = useId();

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
        return (
          <div className="flex flex-col gap-1">
            {label && (
              <label htmlFor={id} className="text-white">
                {label}
                {required ? ' *' : ''}
              </label>
            )}
            <input
              id={id}
              ref={ref}
              type="file"
              accept={accept}
              onBlur={onBlur}
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file ?? undefined);
              }}
              disabled={disabled}
              required={required}
              className="text-white"
            />
            {value instanceof File && <span className="text-xs text-slate-300">{value.name}</span>}
            {fieldState.error?.message && (
              <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
