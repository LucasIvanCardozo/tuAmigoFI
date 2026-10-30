'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { sileo } from 'sileo';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { type ConfirmationInput, confirmationSchema } from '@/app/lib/shared/schemas';
import type { ReactionOutcome } from '../../feature/materias/useReactions';
import { CheckboxForm, Form } from '../form';

export const ModalReportModuleContent = ({
  typeTarget,
  title,
  author,
  onConfirm,
}: {
  typeTarget: 'TP' | 'MIDTERM';
  title: string;
  author: string;
  onConfirm: () => Promise<ReactionOutcome>;
}) => {
  const { control, handleSubmit } = useForm<ConfirmationInput>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { confirm: false },
  });

  const action: SubmitHandler<ConfirmationInput> = async () => {
    const outcome = await onConfirm();
    if (!outcome.ok) throw new Error(outcome.error ?? 'No se pudo guardar el reporte.');
    if (outcome.current !== false) {
      sileo.warning({
        title: 'Tu reporte fue quitado: el archivo ya no tiene ese reporte.',
      });
      return;
    }
    if (outcome.previous === true) {
      sileo.warning({
        title: 'Tu reporte reemplazó el like que hiciste de este archivo.',
      });
      return;
    }
    sileo.success({ title: 'Gracias por tu reporte!' });
  };

  const { closeModal } = useModal();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: '',
    onSuccess: async () => {
      closeModal();
    },
  });

  const isTp = typeTarget === 'TP';

  return (
    <Form onSubmit={handleSubmit(submit)} noValidate>
      <h3 className="text-lg mb-4">
        <b>{isTp ? 'Reportar TP' : 'Reportar examen'}</b>
      </h3>
      <div className="flex flex-col gap-1 *:flex *:gap-1">
        <span>
          <b>Nombre:</b>
          {title}
        </span>
        <span>
          <b>Subido por:</b>
          {author}
        </span>
      </div>
      <p className="text-sm mt-4">
        {isTp
          ? '¿Estás seguro que querés reportar este TP?'
          : '¿Estás seguro que querés reportar este examen?'}
      </p>
      <CheckboxForm<ConfirmationInput>
        name="confirm"
        control={control}
        label="Confirmo que quiero reportarlo."
        required
      />
      <div>
        <h3 className="text-sm">Recuerda!</h3>
        <p className="text-xs">
          Por favor reportá sólo si considerás que el archivo fue subido mal. En caso de cualquier
          problema podes contactarme:{' '}
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
