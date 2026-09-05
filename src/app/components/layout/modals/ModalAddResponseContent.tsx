'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { useReload } from '@/app/hooks/useReload';
import { createResponse } from '@/app/lib/server/actions/responses/create.action';
import { type AddResponseInput, addResponseSchema } from '@/app/lib/shared/schemas';
import type { Module } from '@/app/types';
import { Form, InputForm, ResponseForm, SectionForm } from '../form';

export const ModalAddResponseContent = ({
  module,
  session,
}: {
  module: Module;
  session: Session | null;
}) => {
  const { control, handleSubmit } = useForm<AddResponseInput>({
    resolver: zodResolver(addResponseSchema),
    defaultValues: { number: 1, type: 'TEXT' },
  });

  const isTp = 'number' in module;

  const action: SubmitHandler<AddResponseInput> = async (data) => {
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const { error } = await createResponse({
      idUser: session.user.id,
      idTp: isTp ? module.id : null,
      idMidterm: !isTp ? module.id : null,
      number: data.number,
      type: data.type,
      text: data.type === 'TEXT' || data.type === 'CODE' ? (data.text ?? null) : null,
      file: data.type === 'IMAGE' || data.type === 'PDF' ? (data.file ?? null) : null,
    });
    if (error) throw new Error(error);
  };

  const { closeModal } = useModal();
  const { startReload } = useReload();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Muchas gracias por tu aporte! ❤️',
    onSuccess: async () => {
      startReload();
      closeModal();
    },
  });

  return (
    <>
      <h2 className="text-lg">Añadir una respuesta</h2>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <SectionForm title="Datos de la respuesta">
          <InputForm<AddResponseInput>
            name="number"
            type="number"
            control={control}
            label="Número"
            min={1}
            max={100}
            required
          />
          <ResponseForm<AddResponseInput> control={control} />
        </SectionForm>
        <div>
          <p>Esta respuesta se añadirá al módulo &quot;{module.name}&quot;</p>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que las respuestas estén legibles y sean para este módulo. En
            caso de cualquier problema podes contactarme:{' '}
            <a
              className="underline"
              target="_blank"
              href="https://wa.me/+5492235319564"
              rel="noopener"
            >
              2235319564
            </a>
          </p>
        </div>
        <div className="flex gap-4 justify-center mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aceptar
          </button>
        </div>
      </Form>
    </>
  );
};
