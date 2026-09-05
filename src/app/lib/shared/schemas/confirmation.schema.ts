import { boolean, object } from 'zod';

export const confirmationSchema = object({
  confirm: boolean().refine((v) => v === true, {
    message: 'Debes confirmar la acción',
  }),
});

export type ConfirmationInput = {
  confirm: boolean;
};
