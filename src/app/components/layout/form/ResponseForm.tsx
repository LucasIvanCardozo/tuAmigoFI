'use client';

import type { ChangeEvent, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import { compressImageForUpload } from '@/app/lib/shared/image-compressor';

type ResponseType = 'TEXT' | 'CODE' | 'IMAGE' | 'PDF';

interface ResponseFormProps<T extends FieldValues> {
  control: Control<T>;
  typeName?: Path<T>;
  textName?: Path<T>;
  fileName?: Path<T>;
  typeLabel?: string;
}

interface ResponseFileFieldProps {
  type: 'IMAGE' | 'PDF';
  value: File | undefined;
  errorMessage?: string;
  inputRef: Ref<HTMLInputElement>;
  onBlur: () => void;
  onChange: (value: File | undefined) => void;
}

const TEXT_LIKE: ResponseType[] = ['TEXT', 'CODE'];

const ResponseFileField = ({
  type,
  value,
  errorMessage,
  inputRef,
  onBlur,
  onChange,
}: ResponseFileFieldProps) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const latestType = useRef(type);
  const isImage = type === 'IMAGE';

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

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        onBlur={onBlur}
        type="file"
        accept={isImage ? 'image/*' : 'application/pdf'}
        onChange={handleChange}
        disabled={isCompressing}
        className="text-white"
      />
      {isCompressing && <span className="text-xs text-slate-300">Procesando imagen...</span>}
      {!isCompressing && value instanceof File && (
        <span className="text-xs text-slate-300">{value.name}</span>
      )}
      {localError && <p className="text-red-600 text-sm">{localError}</p>}
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
    </div>
  );
};

export function ResponseForm<T extends FieldValues>({
  control,
  typeName = 'type' as Path<T>,
  textName = 'text' as Path<T>,
  fileName = 'file' as Path<T>,
  typeLabel = 'Tipo de respuesta',
}: ResponseFormProps<T>) {
  const currentType = useWatch({ control, name: typeName }) as ResponseType | undefined;

  return (
    <div className="flex flex-col gap-2">
      <Controller
        name={typeName}
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <label className="text-white" htmlFor="response-type">
              {typeLabel}
            </label>
            <select
              {...field}
              id="response-type"
              value={(field.value as string | undefined) ?? ''}
              className="text-black px-2 py-1 rounded border border-slate-700"
            >
              <option value="" hidden>
                Selecciona el tipo respuesta
              </option>
              <option value="TEXT">Texto</option>
              <option value="IMAGE">Imagen</option>
              <option value="PDF">Pdf</option>
              <option value="CODE">Código</option>
            </select>
            {fieldState.error?.message && (
              <p className="text-red-600 text-sm">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {currentType && TEXT_LIKE.includes(currentType) && (
        <Controller
          name={textName}
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1">
              <textarea
                {...field}
                id="response-text"
                value={(field.value as string | undefined) ?? ''}
                rows={currentType === 'CODE' ? 10 : 3}
                cols={50}
                placeholder={
                  currentType === 'CODE' ? 'Pega tu código aquí...' : 'Ingresa tu respuesta aquí...'
                }
                className="text-black px-2 py-1 rounded border border-slate-700"
              />
              {fieldState.error?.message && (
                <p className="text-red-600 text-sm">{fieldState.error.message}</p>
              )}
            </div>
          )}
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
                type={currentType}
                value={value}
                errorMessage={fieldState.error?.message}
                inputRef={ref}
                onBlur={onBlur}
                onChange={onChange}
              />
            );
          }}
        />
      )}
    </div>
  );
}
