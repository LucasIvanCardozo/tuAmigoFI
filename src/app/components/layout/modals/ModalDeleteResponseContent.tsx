'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { useReload } from '@/app/hooks/useReload';
import { deleteResponse } from '@/app/lib/server/actions/responses/delete.action';
import type { Response, User } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type ConfirmationInput, confirmationSchema } from '@/app/lib/shared/schemas';
import { CheckboxForm, Form } from '../form';

export const ModalDeleteResponseContent = ({
  response,
  user,
}: {
  response: Response;
  user: User;
}) => {
  const { id, idUser } = response;
  const { control, handleSubmit } = useForm<ConfirmationInput>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { confirm: false },
  });

  const { data: session } = useSession();

  const action: SubmitHandler<ConfirmationInput> = async () => {
    if (!session) throw new Error('No hay sesion');
    if (session.user.tier !== 2 && session.user.id !== user.id)
      throw new Error('Debes ser administrador o el creador para eliminar una respuesta');

    const { error } = await deleteResponse({ id, idUser });
    if (error) throw new Error(`Error: ${error}`);
  };

  const { closeModal } = useModal();
  const { startReload } = useReload();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Respuesta eliminada.',
    onSuccess: async () => {
      startReload();
      closeModal();
    },
  });

  return (
    <>
      <h2 className="text-lg">Eliminar respuesta</h2>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <div>
          <div className="flex flex-col *:flex *:gap-1">
            <p>
              <b>Numero del problema:</b>
              {response.number}
            </p>
            <p>
              <b>Subida por:</b>
              {user.name}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que la respuesta sea la que quieres eliminar. Se borrara esta
            misma con todas sus reacciones. En caso de cualquier problema podés contactarme:{' '}
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
        <CheckboxForm<ConfirmationInput>
          name="confirm"
          control={control}
          label="Confirmo la eliminación."
          required
        />
        <div className="flex gap-4 justify-center mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Eliminar
          </button>
        </div>
      </Form>
    </>
  );
};
