import { file, number, object, string } from 'zod';

export const addTpSchema = object({
  name: string().min(1, 'El título es obligatorio'),
  number: number({ message: 'Debe ser un número' })
    .int()
    .min(1, 'El número debe ser mayor o igual a 1')
    .max(30, 'El número debe ser menor o igual a 30'),
  year: number({ message: 'Debe ser un número' })
    .int()
    .min(2000, 'El año debe ser mayor o igual a 2000')
    .max(new Date().getFullYear(), 'El año no puede ser futuro'),
  file: file()
    .refine((f) => f.size < 5_000_000, 'El archivo debe pesar menos de 5 MB')
    .refine((f) => f.type === 'application/pdf', 'Solo se admite formato PDF'),
});

export type AddTpInput = {
  name: string;
  number: number;
  year: number;
  file: File;
};
