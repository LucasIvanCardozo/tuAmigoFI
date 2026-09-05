'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { useReload } from '@/app/hooks/useReload';
import { deleteMidterm } from '@/app/lib/server/actions/midterms/delete.action';
import type { Midterm, User } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type ConfirmationInput, confirmationSchema } from '@/app/lib/shared/schemas';
import { CheckboxForm, Form } from '../form';

export const ModalDeleteMidtermContent = ({
  midterm,
  user,
  session,
}: {
  midterm: Midterm;
  user: User;
  session: Session | null;
}) => {
  const { control, handleSubmit } = useForm<ConfirmationInput>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { confirm: false },
  });

  const action: SubmitHandler<ConfirmationInput> = async () => {
    if (!session) throw new Error('No hay sesion');
    if (session.user.tier !== 2 && session.user.id !== user.id)
      throw new Error('Debes ser administrador o el creador para eliminar un examen');

    const formData = new FormData();
    formData.set('id', midterm.id.toString());
    formData.set('subFolder', `parciales/respuestas/${midterm.id}`);
    const res = await fetch('/api/destroyAll', {
      method: 'POST',
      body: formData,
    });

    formData.set('id', midterm.id.toString());
    formData.set('subFolder', `parciales/problemas`);

    const res2 = await fetch('/api/destroy', {
      method: 'POST',
      body: formData,
    });

    if (res.ok && res2.ok) {
      const { error } = await deleteMidterm({
        id: midterm.id,
        idUser: midterm.idUser,
      });
      if (error) throw new Error(error);
    }
  };

  const { closeModal } = useModal();
  const { startReload } = useReload();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Examen eliminado.',
    onSuccess: async () => {
      startReload();
      closeModal();
    },
  });

  return (
    <>
      <h2 className="text-lg">Eliminar Examen</h2>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <div className="flex flex-col *:flex *:gap-1">
          <p>
            <b>Nombre:</b>
            {midterm.name}
          </p>
          <p>
            <b>Subido por:</b>
            {user.name}
          </p>

          <p>
            <b>Fecha:</b>
            {`${midterm.date.getMonth() + 1}/${midterm.date.getFullYear()}`}
          </p>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que el examen que quieres eliminar sea el correcto. Se eliminaran
            todos los problemas, las respuestas y sus reacciones. En caso de cualquier problema
            podes contactarme:{' '}
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
