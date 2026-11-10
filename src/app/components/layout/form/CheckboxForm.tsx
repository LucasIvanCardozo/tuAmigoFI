'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FieldError, FieldHelper, FieldLabel, fieldDescribedBy } from './form';

interface CheckboxFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helper?: ReactNode;
}

export function CheckboxForm<T extends FieldValues>({
  name,
  control,
  label,
  required,
  disabled,
  helper,
}: CheckboxFormProps<T>) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <input
                id={id}
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                ref={field.ref}
                disabled={disabled}
                required={required}
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby={fieldDescribedBy(
                  helper ? helperId : undefined,
                  fieldState.error ? errorId : undefined,
                )}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#92C1C9]"
              />
              <FieldLabel id={id} label={label} required={required} />
            </div>
            <FieldHelper id={helperId}>{helper}</FieldHelper>
            <FieldError id={errorId} message={error} />
          </div>
        );
      }}
    />
  );
}
