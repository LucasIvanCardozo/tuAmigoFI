'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { useReload } from '@/app/hooks/useReload';
import { deleteLink } from '@/app/lib/server/actions/links/delete.action';
import type { Link } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type ConfirmationInput, confirmationSchema } from '@/app/lib/shared/schemas';
import { CheckboxForm, Form } from '../form';

export const ModalDeleteLinkContent = ({ link }: { link: Link }) => {
  const { data: session } = useSession();
  const { control, handleSubmit } = useForm<ConfirmationInput>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { confirm: false },
  });

  const action: SubmitHandler<ConfirmationInput> = async () => {
    if (!session) throw new Error('No hay sesion');
    if (session.user.tier !== 2 && session.user.id !== link.idUser)
      throw new Error('Debes ser administrador o el creador para eliminar un link');
    await deleteLink({ id: link.id, idUser: link.idUser });
  };

  const { closeModal } = useModal();
  const { startReload } = useReload();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Link eliminado.',
    onSuccess: async () => {
      startReload();
      closeModal();
    },
  });

  return (
    <>
      <h2 className="text-lg mb-4">
        <b>Eliminar link</b>
      </h2>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <div className="flex flex-col gap-1 *:flex *:gap-1">
          <span>
            <b>Nombre:</b>
            {link.name}
          </span>
          <span>
            <b>Link:</b>
            <a href={link.link} className="hover:underline">
              {link.link}
            </a>
          </span>
        </div>
        <CheckboxForm<ConfirmationInput>
          name="confirm"
          control={control}
          label="Quiero eliminarlo"
          required
        />
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor elimine el link solo si considera que este no debería estar presente en la
            página. En caso de cualquier problema podes contactarme:{' '}
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
            Eliminar
          </button>
        </div>
      </Form>
    </>
  );
};
