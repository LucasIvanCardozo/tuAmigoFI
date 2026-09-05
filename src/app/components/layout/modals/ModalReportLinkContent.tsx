'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import type { Link } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type ConfirmationInput, confirmationSchema } from '@/app/lib/shared/schemas';
import { CheckboxForm, Form } from '../form';

export const ModalReportLinkContent = ({ link }: { link: Link }) => {
  const { data: session } = useSession();
  const { control, handleSubmit } = useForm<ConfirmationInput>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { confirm: false },
  });

  const action: SubmitHandler<ConfirmationInput> = async () => {
    if (!session?.user) throw new Error('Debes iniciar sesion para reportar un link');
  };

  const { closeModal } = useModal();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Gracias por tu reporte!',
    onSuccess: async () => {
      closeModal();
    },
  });

  return (
    <Form onSubmit={handleSubmit(submit)} noValidate>
      <h3 className="text-lg mb-4">
        <b>Reportar link</b>
      </h3>
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
        label="Quiero reportarlo"
        required
      />
      <div>
        <h3 className="text-sm">Recuerda!</h3>
        <p className="text-xs">
          Por favor sea reporte el link solo si considera que este no debería estar presente en la
          pagina. En caso de cualquier problema podes contactarme:{' '}
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
          Reportar
        </button>
      </div>
    </Form>
  );
};
