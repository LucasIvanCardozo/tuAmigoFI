'use client';

import { useTransition } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { sileo } from 'sileo';

interface UseFormSubmitOptions<TInput> {
  action: SubmitHandler<TInput>;
  successMessage?: string;
  onSuccess?: () => void | Promise<void>;
}

export function useFormSubmit<TInput>({
  action,
  successMessage = 'Operación exitosa',
  onSuccess,
}: UseFormSubmitOptions<TInput>) {
  const [isLoading, startTransition] = useTransition();

  const submit: SubmitHandler<TInput> = (data) => {
    startTransition(async () => {
      try {
        await action(data);
        if (onSuccess) await onSuccess();
        if (successMessage) sileo.success({ title: successMessage });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        sileo.error({ title: message });
      }
    });
  };

  return { submit, isLoading };
}
