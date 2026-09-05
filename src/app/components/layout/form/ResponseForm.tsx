'use client';

import type { Ref } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';

type ResponseType = 'TEXT' | 'CODE' | 'IMAGE' | 'PDF';

interface ResponseFormProps<T extends FieldValues> {
  control: Control<T>;
  typeName?: Path<T>;
  textName?: Path<T>;
  fileName?: Path<T>;
  typeLabel?: string;
}

const TEXT_LIKE: ResponseType[] = ['TEXT', 'CODE'];

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
          render={({ field, fieldState }) => {
            const { value, onChange, onBlur, ref } = field as {
              value: File | undefined;
              onChange: (v: File | undefined) => void;
              onBlur: () => void;
              ref: Ref<HTMLInputElement>;
            };
            return (
              <div className="flex flex-col gap-1">
                <input
                  ref={ref}
                  onBlur={onBlur}
                  type="file"
                  accept={currentType === 'IMAGE' ? 'image/*' : 'application/pdf'}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file ?? undefined);
                  }}
                  className="text-white"
                />
                {value instanceof File && (
                  <span className="text-xs text-slate-300">{value.name}</span>
                )}
                {fieldState.error?.message && (
                  <p className="text-red-600 text-sm">{fieldState.error.message}</p>
                )}
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
