'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
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
import { ModalActions, ModalContactLine, ModalFileTools, ModalNotice } from './modal-parts';

const RESPONSE_TYPE_OPTIONS: ResponseTypeOption[] = [
  { value: 'TEXT', label: 'Texto' },
  { value: 'CODE', label: 'Código' },
  { value: 'IMAGE', label: 'Imagen' },
  { value: 'PDF', label: 'PDF' },
];

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
      <ModalNotice>
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
      </ModalNotice>
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
      <SectionForm number={2} title={hasFile ? 'Archivo' : 'La respuesta'}>
        <ResponseContentField<AddResponseInput> control={control} fileRequired />
        {allProblems && !isTp && <ModalFileTools />}
      </SectionForm>
      <ModalContactLine />
      <ModalActions primaryLabel="Enviar respuesta" isLoading={isLoading} />
    </Form>
  );
};
