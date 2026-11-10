'use client';

import type { ChangeEvent, ReactNode, Ref } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import { compressImageForUpload } from '@/app/lib/shared/image-compressor';
import {
  FieldError,
  FieldHelper,
  FieldLabel,
  FileRow,
  fieldDescribedBy,
  formatFileSize,
  inputClass,
} from './form';

type ResponseType = 'TEXT' | 'CODE' | 'IMAGE' | 'PDF';

export interface ResponseTypeOption {
  value: ResponseType;
  label: string;
}

export const DEFAULT_RESPONSE_TYPE_OPTIONS: ResponseTypeOption[] = [
  { value: 'TEXT', label: 'Texto' },
  { value: 'IMAGE', label: 'Imagen' },
  { value: 'PDF', label: 'Pdf' },
  { value: 'CODE', label: 'Código' },
];

interface ResponseFileFieldProps {
  id: string;
  type: 'IMAGE' | 'PDF';
  value: File | undefined;
  errorMessage?: string;
  label?: string;
  helper?: ReactNode;
  required?: boolean;
  inputRef: Ref<HTMLInputElement>;
  onBlur: () => void;
  onChange: (value: File | undefined) => void;
}

const TEXT_LIKE: ResponseType[] = ['TEXT', 'CODE'];

const ResponseFileField = ({
  id,
  type,
  value,
  errorMessage,
  label,
  helper,
  required,
  inputRef,
  onBlur,
  onChange,
}: ResponseFileFieldProps) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const latestType = useRef(type);
  const isImage = type === 'IMAGE';
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  useEffect(() => {
    if (latestType.current === type) return;
    latestType.current = type;
    setLocalError(null);
    onChange(undefined);
  }, [type, onChange]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    setLocalError(null);

    if (!file) {
      onChange(undefined);
      input.value = '';
      return;
    }

    if (!isImage) {
      onChange(file);
      input.value = '';
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressImageForUpload(file);
      if (latestType.current === type) {
        onChange(compressed);
      }
    } catch {
      setLocalError('No se pudo procesar la imagen. Intenta con otra.');
      onChange(undefined);
    } finally {
      setIsCompressing(false);
      input.value = '';
    }
  };

  const state = isCompressing
    ? 'Procesando imagen...'
    : value instanceof File
      ? `${value.name} · ${formatFileSize(value.size)}`
      : 'Ningún archivo seleccionado';

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel id={id} label={label} required={required} />
      <FileRow
        id={id}
        inputRef={inputRef}
        accept={isImage ? 'image/*' : 'application/pdf'}
        disabled={isCompressing}
        invalid={Boolean(localError ?? errorMessage)}
        required={required}
        state={state}
        describedBy={fieldDescribedBy(
          helper ? helperId : undefined,
          (localError ?? errorMessage) ? errorId : undefined,
        )}
        onBlur={onBlur}
        onChange={handleChange}
      />
      <FieldHelper id={helperId}>{helper}</FieldHelper>
      <FieldError id={errorId} message={localError ?? errorMessage} />
    </div>
  );
};

interface ResponseTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  typeName?: Path<T>;
  typeLabel?: string;
  typeHelper?: ReactNode;
  typeOptions?: ResponseTypeOption[];
  required?: boolean;
}

export function ResponseTypeField<T extends FieldValues>({
  control,
  typeName = 'type' as Path<T>,
  typeLabel = 'Tipo de respuesta',
  typeHelper,
  typeOptions = DEFAULT_RESPONSE_TYPE_OPTIONS,
  required,
}: ResponseTypeFieldProps<T>) {
  const typeId = useId();
  const typeHelperId = `${typeId}-helper`;
  const typeErrorId = `${typeId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel id={typeId} label={typeLabel} required={required} />
      <Controller
        name={typeName}
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message;
          return (
            <div className="flex flex-col gap-1">
              <select
                {...field}
                id={typeId}
                value={(field.value as string | undefined) ?? ''}
                required={required}
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby={fieldDescribedBy(
                  typeHelper ? typeHelperId : undefined,
                  fieldState.error ? typeErrorId : undefined,
                )}
                className={inputClass}
              >
                <option value="" hidden>
                  Selecciona el tipo respuesta
                </option>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldHelper id={typeHelperId}>{typeHelper}</FieldHelper>
              <FieldError id={typeErrorId} message={error} />
            </div>
          );
        }}
      />
    </div>
  );
}

interface ResponseContentFieldProps<T extends FieldValues> {
  control: Control<T>;
  typeName?: Path<T>;
  textName?: Path<T>;
  fileName?: Path<T>;
  textHelper?: ReactNode;
  fileLabel?: string;
  fileHelper?: ReactNode;
  fileRequired?: boolean;
}

export function ResponseContentField<T extends FieldValues>({
  control,
  typeName = 'type' as Path<T>,
  textName = 'text' as Path<T>,
  fileName = 'file' as Path<T>,
  textHelper,
  fileLabel,
  fileHelper,
  fileRequired,
}: ResponseContentFieldProps<T>) {
  const currentType = useWatch({ control, name: typeName }) as ResponseType | undefined;
  const textId = useId();
  const fileId = useId();
  const textHelperId = `${textId}-helper`;
  const textErrorId = `${textId}-error`;

  return (
    <>
      {currentType && TEXT_LIKE.includes(currentType) && (
        <Controller
          name={textName}
          control={control}
          render={({ field, fieldState }) => {
            const error = fieldState.error?.message;
            return (
              <div className="flex flex-col gap-1">
                <textarea
                  {...field}
                  id={textId}
                  value={(field.value as string | undefined) ?? ''}
                  rows={currentType === 'CODE' ? 10 : 3}
                  placeholder={
                    currentType === 'CODE'
                      ? 'Pega tu código aquí...'
                      : 'Ingresa tu respuesta aquí...'
                  }
                  aria-invalid={fieldState.error ? true : undefined}
                  aria-describedby={fieldDescribedBy(
                    textHelper ? textHelperId : undefined,
                    fieldState.error ? textErrorId : undefined,
                  )}
                  className={inputClass}
                />
                <FieldHelper id={textHelperId}>{textHelper}</FieldHelper>
                <FieldError id={textErrorId} message={error} />
              </div>
            );
          }}
        />
      )}

      {currentType && (currentType === 'IMAGE' || currentType === 'PDF') && (
        <Controller
          name={fileName}
          control={control}
          shouldUnregister
          render={({ field, fieldState }) => {
            const { value, onChange, onBlur, ref } = field as {
              value: File | undefined;
              onChange: (v: File | undefined) => void;
              onBlur: () => void;
              ref: Ref<HTMLInputElement>;
            };
            return (
              <ResponseFileField
                id={fileId}
                type={currentType}
                value={value}
                errorMessage={fieldState.error?.message}
                label={fileLabel}
                helper={fileHelper}
                required={fileRequired}
                inputRef={ref}
                onBlur={onBlur}
                onChange={onChange}
              />
            );
          }}
        />
      )}
    </>
  );
}

interface ResponseFormProps<T extends FieldValues> {
  control: Control<T>;
  typeName?: Path<T>;
  textName?: Path<T>;
  fileName?: Path<T>;
  typeLabel?: string;
  typeHelper?: ReactNode;
  textHelper?: ReactNode;
  fileLabel?: string;
  fileHelper?: ReactNode;
  fileRequired?: boolean;
  typeOptions?: ResponseTypeOption[];
}

export function ResponseForm<T extends FieldValues>({
  control,
  typeName = 'type' as Path<T>,
  textName = 'text' as Path<T>,
  fileName = 'file' as Path<T>,
  typeLabel = 'Tipo de respuesta',
  typeHelper,
  textHelper,
  fileLabel,
  fileHelper,
  fileRequired,
  typeOptions = DEFAULT_RESPONSE_TYPE_OPTIONS,
}: ResponseFormProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <ResponseTypeField<T>
        control={control}
        typeName={typeName}
        typeLabel={typeLabel}
        typeHelper={typeHelper}
        typeOptions={typeOptions}
      />
      <ResponseContentField<T>
        control={control}
        typeName={typeName}
        textName={textName}
        fileName={fileName}
        textHelper={textHelper}
        fileLabel={fileLabel}
        fileHelper={fileHelper}
        fileRequired={fileRequired}
      />
    </div>
  );
}
