'use client';

import { type ReactNode, useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface SelectFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function SelectForm<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  disabled,
  children,
}: SelectFormProps<T>) {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && (
            <label htmlFor={id} className="text-white">
              {label}
              {required ? ' *' : ''}
            </label>
          )}
          <select
            {...field}
            id={id}
            value={(field.value as string | undefined) ?? ''}
            disabled={disabled}
            required={required}
            className="text-black px-2 py-1 rounded border border-slate-700"
          >
            {placeholder && (
              <option value="" hidden>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {fieldState.error?.message && (
            <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
