import { object, string } from 'zod';

export const addCorrelativeSchema = object({
  idCorrelative: string().min(1, 'Selecciona una materia correlativa'),
});

export type AddCorrelativeInput = {
  idCorrelative: string;
};
