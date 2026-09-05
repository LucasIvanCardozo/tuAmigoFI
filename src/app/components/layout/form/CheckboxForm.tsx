'use client';

import { useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface CheckboxFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CheckboxForm<T extends FieldValues>({
  name,
  control,
  label,
  required,
  disabled,
}: CheckboxFormProps<T>) {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center text-white">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              ref={field.ref}
              disabled={disabled}
              required={required}
            />
            {label && (
              <label htmlFor={id}>
                {label}
                {required ? ' *' : ''}
              </label>
            )}
          </div>
          {fieldState.error?.message && (
            <p className="text-red-600 text-sm">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
