'use client';

import { type ReactNode, useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FieldError, FieldHelper, FieldLabel, fieldDescribedBy, inputClass } from './form';

interface SelectFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helper?: ReactNode;
  children: ReactNode;
}

export function SelectForm<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  disabled,
  helper,
  children,
}: SelectFormProps<T>) {
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
            <FieldLabel id={id} label={label} required={required} />
            <select
              {...field}
              id={id}
              value={(field.value as string | undefined) ?? ''}
              disabled={disabled}
              required={required}
              aria-invalid={fieldState.error ? true : undefined}
              aria-describedby={fieldDescribedBy(
                helper ? helperId : undefined,
                error ? errorId : undefined,
              )}
              className={inputClass}
            >
              {placeholder && (
                <option value="" hidden>
                  {placeholder}
                </option>
              )}
              {children}
            </select>
            <FieldHelper id={helperId}>{helper}</FieldHelper>
            <FieldError id={errorId} message={error} />
          </div>
        );
      }}
    />
  );
}
