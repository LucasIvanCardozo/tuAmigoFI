import { boolean, file, object, string } from 'zod';

export const addMidtermSchema = object({
  name: string().min(1, 'El título es obligatorio'),
  date: string().min(1, 'La fecha es obligatoria'),
  file: file()
    .refine((f) => f.size < 5_000_000, 'El archivo debe pesar menos de 5 MB')
    .refine((f) => f.type === 'application/pdf', 'Solo se admite formato PDF'),
  withoutAnswers: boolean().refine(
    (value) => value,
    'Tenés que confirmar que el parcial no tiene las respuestas',
  ),
});

export type AddMidtermInput = {
  name: string;
  date: string;
  file: File;
  withoutAnswers: boolean;
};
