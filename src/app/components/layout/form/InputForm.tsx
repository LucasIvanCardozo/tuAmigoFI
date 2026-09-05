'use client';

import { useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface BaseProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

interface TextLikeProps<T extends FieldValues> extends BaseProps<T> {
  type?: 'text' | 'email' | 'password' | 'url';
  minLength?: number;
  maxLength?: number;
}

interface NumberProps<T extends FieldValues> extends BaseProps<T> {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

interface DateProps<T extends FieldValues> extends BaseProps<T> {
  type: 'date';
}

interface TextareaProps<T extends FieldValues> extends BaseProps<T> {
  type: 'textarea';
  rows?: number;
  cols?: number;
  minLength?: number;
  maxLength?: number;
}

export type InputFormProps<T extends FieldValues> =
  | TextLikeProps<T>
  | NumberProps<T>
  | DateProps<T>
  | TextareaProps<T>;

const inputClass = 'text-black px-2 py-1 rounded border border-slate-700 w-full';

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-600 text-sm mt-1">{message}</p>;
}

export function InputForm<T extends FieldValues>(props: InputFormProps<T>) {
  const { name, control, label, required, disabled } = props;
  const id = useId();

  const renderLabel = () => {
    if (!label) return null;
    return (
      <label htmlFor={id} className="text-white">
        {label}
        {required ? ' *' : ''}
      </label>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;
        if (props.type === 'textarea') {
          return (
            <div className="flex flex-col gap-1">
              {renderLabel()}
              <textarea
                {...field}
                id={id}
                value={(field.value as string | undefined) ?? ''}
                placeholder={props.placeholder}
                rows={props.rows}
                cols={props.cols}
                disabled={disabled}
                required={required}
                className={inputClass}
              />
              <ErrorMessage message={error} />
            </div>
          );
        }

        if (props.type === 'number') {
          return (
            <div className="flex flex-col gap-1">
              {renderLabel()}
              <input
                {...field}
                id={id}
                type="number"
                value={(field.value as number | string | undefined) ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  field.onChange(raw === '' ? undefined : Number(raw));
                }}
                min={props.min}
                max={props.max}
                step={props.step}
                placeholder={props.placeholder}
                disabled={disabled}
                required={required}
                className={inputClass}
              />
              <ErrorMessage message={error} />
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-1">
            {renderLabel()}
            <input
              {...field}
              id={id}
              type={props.type ?? 'text'}
              value={(field.value as string | undefined) ?? ''}
              placeholder={props.placeholder}
              minLength={props.type === undefined ? props.minLength : undefined}
              maxLength={props.type === undefined ? props.maxLength : undefined}
              disabled={disabled}
              required={required}
              className={inputClass}
            />
            <ErrorMessage message={error} />
          </div>
        );
      }}
    />
  );
}
