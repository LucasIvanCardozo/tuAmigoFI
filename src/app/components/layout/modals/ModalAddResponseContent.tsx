'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import type { ReactNode } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import {
  HiOutlineDocumentArrowUp,
  HiOutlineInformationCircle,
  HiOutlineScissors,
} from 'react-icons/hi2';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { createResponse } from '@/app/lib/server/actions/responses/create.action';
import { type AddResponseInput, addResponseSchema } from '@/app/lib/shared/schemas';
import type { Module } from '@/app/types';
import {
  CheckboxForm,
  Form,
  InputForm,
  ResponseContentField,
  ResponseTypeField,
  type ResponseTypeOption,
  SectionForm,
} from '../form';

const RESPONSE_TYPE_OPTIONS: ResponseTypeOption[] = [
  { value: 'TEXT', label: 'Texto — se escribe en el modal' },
  { value: 'CODE', label: 'Código — se pega en el modal' },
  { value: 'IMAGE', label: 'Imagen — JPG o PNG (se comprime sola)' },
  { value: 'PDF', label: 'PDF — sólo PDF' },
];

const Notice = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2 rounded-lg bg-(--midnight-green) p-3">
    <HiOutlineInformationCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
    <p className="text-xs font-medium text-(--silver)">{children}</p>
  </div>
);

const FileTools = () => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-wrap gap-2">
      <a
        href="https://www.ilovepdf.com/es/eliminar-paginas"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-700"
      >
        <HiOutlineScissors aria-hidden="true" className="h-4 w-4" />
        Eliminar páginas
      </a>
      <a
        href="https://tools.pdf24.org/es/convertidor-pdf"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-700"
      >
        <HiOutlineDocumentArrowUp aria-hidden="true" className="h-4 w-4" />
        Convertir a PDF
      </a>
    </div>
    <p className="text-xs text-(--silver)">iLovePDF y PDF24: se abren en otra pestaña.</p>
  </div>
);

const ContactLine = () => (
  <p className="text-xs text-(--silver)">
    ¿Algún problema con la carga? Escribinos por WhatsApp:{' '}
    <a
      href="https://wa.me/+5492235319564"
      target="_blank"
      rel="noopener"
      className="font-semibold text-white underline"
    >
      2235319564
    </a>
  </p>
);

export const ModalAddResponseContent = ({
  module,
  session,
}: {
  module: Module;
  session: Session | null;
}) => {
  const { control, handleSubmit } = useForm<AddResponseInput>({
    resolver: zodResolver(addResponseSchema),
    defaultValues: { number: 1, type: 'TEXT', allProblems: false },
  });

  const isTp = 'number' in module;
  const allProblems = Boolean(useWatch({ control, name: 'allProblems' }));
  const responseType = useWatch({ control, name: 'type' });
  const hasFile = responseType === 'IMAGE' || responseType === 'PDF';

  const action: SubmitHandler<AddResponseInput> = async (data) => {
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const { error } = await createResponse({
      idTp: isTp ? module.id : null,
      idMidterm: !isTp ? module.id : null,
      number: data.number,
      type: data.type,
      text: data.type === 'TEXT' || data.type === 'CODE' ? (data.text ?? null) : null,
      file: data.type === 'IMAGE' || data.type === 'PDF' ? (data.file ?? null) : null,
      allProblems: data.allProblems,
    });
    if (error) throw new Error(error);
  };

  const { closeModal } = useModal();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Muchas gracias por tu aporte! ❤️',
    onSuccess: async () => {
      closeModal();
    },
  });

  return (
    <Form onSubmit={handleSubmit(submit)} noValidate>
      <Notice>
        {isTp ? (
          <>
            <strong className="font-bold text-white">Revisá antes de subir:</strong> que la
            respuesta se lea bien y sea de este módulo.
          </>
        ) : (
          <>
            <strong className="font-bold text-white">Revisá antes de subir:</strong> que la
            respuesta se lea bien y sea de este parcial.
          </>
        )}
      </Notice>
      <SectionForm number={1} title="Datos de la respuesta">
        {!isTp && (
          <CheckboxForm<AddResponseInput>
            name="allProblems"
            control={control}
            label="Subir un archivo con todas las respuestas"
            helper="Un solo archivo que cubre todos los puntos del parcial. Sólo existe en parciales."
          />
        )}
        <ResponseTypeField<AddResponseInput>
          control={control}
          typeHelper="Imagen: JPG o PNG (se comprime sola). PDF: sólo PDF."
          typeOptions={RESPONSE_TYPE_OPTIONS}
          required
        />
        {!allProblems && (
          <InputForm<AddResponseInput>
            name="number"
            type="number"
            control={control}
            label="Número de problema"
            min={1}
            max={100}
            helper="Número del problema (1 a 100)."
            required
          />
        )}
      </SectionForm>
      <SectionForm number={2} title={hasFile ? 'El archivo' : 'La respuesta'}>
        <ResponseContentField<AddResponseInput>
          control={control}
          fileLabel="Archivo de la respuesta"
          fileHelper="Sólo PDF, hasta 5 MB."
          fileRequired
        />
        {allProblems && !isTp && <FileTools />}
      </SectionForm>
      <ContactLine />
      <div className="flex items-center justify-end gap-3 border-t border-slate-700 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md border-2 border-[#92C1C9] bg-[#92C1C9] px-4 py-2 text-sm font-semibold text-(--black) transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar respuesta
        </button>
      </div>
    </Form>
  );
};
