'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FieldError, FieldHelper, FieldLabel, fieldDescribedBy, inputClass } from './form';

interface BaseProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helper?: ReactNode;
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
  minLength?: number;
  maxLength?: number;
}

export type InputFormProps<T extends FieldValues> =
  | TextLikeProps<T>
  | NumberProps<T>
  | DateProps<T>
  | TextareaProps<T>;

export function InputForm<T extends FieldValues>(props: InputFormProps<T>) {
  const { name, control, label, required, disabled, helper } = props;
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;
        const aria = {
          'aria-invalid': fieldState.error ? true : undefined,
          'aria-describedby': fieldDescribedBy(
            helper ? helperId : undefined,
            error ? errorId : undefined,
          ),
        };

        const labelNode = <FieldLabel id={id} label={label} required={required} />;
        const helperNode = <FieldHelper id={helperId}>{helper}</FieldHelper>;
        const errorNode = <FieldError id={errorId} message={error} />;

        if (props.type === 'textarea') {
          return (
            <div className="flex flex-col gap-1">
              {labelNode}
              <textarea
                {...field}
                {...aria}
                id={id}
                value={(field.value as string | undefined) ?? ''}
                placeholder={props.placeholder}
                rows={props.rows}
                minLength={props.minLength}
                maxLength={props.maxLength}
                disabled={disabled}
                required={required}
                className={inputClass}
              />
              {helperNode}
              {errorNode}
            </div>
          );
        }

        if (props.type === 'number') {
          return (
            <div className="flex flex-col gap-1">
              {labelNode}
              <input
                {...field}
                {...aria}
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
              {helperNode}
              {errorNode}
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-1">
            {labelNode}
            <input
              {...field}
              {...aria}
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
            {helperNode}
            {errorNode}
          </div>
        );
      }}
    />
  );
}
