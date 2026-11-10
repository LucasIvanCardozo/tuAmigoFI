import { cuid, number, object, string } from 'zod';
import {
  ID_COURSE_ERROR,
  INTEGER_ERROR,
  NUMBER_ERROR,
  NUMBER_MIN_ERROR,
  pdfFileSchema,
} from './upload.schema';

export const TITLE_ERROR = 'El título es obligatorio';
export const NUMBER_MAX_ERROR = 'El número debe ser menor o igual a 30';
export const YEAR_MIN_ERROR = 'El año debe ser mayor o igual a 2000';
export const YEAR_MAX_ERROR = 'El año no puede ser futuro';

export const addTpSchema = object({
  name: string({ message: TITLE_ERROR }).min(1, TITLE_ERROR),
  number: number({ message: NUMBER_ERROR })
    .int(INTEGER_ERROR)
    .min(1, NUMBER_MIN_ERROR)
    .max(30, NUMBER_MAX_ERROR),
  year: number({ message: NUMBER_ERROR })
    .int(INTEGER_ERROR)
    .min(2000, YEAR_MIN_ERROR)
    .max(new Date().getFullYear(), YEAR_MAX_ERROR),
  file: pdfFileSchema,
});

export const addTpActionSchema = addTpSchema.extend({
  idCourse: cuid({ message: ID_COURSE_ERROR }),
});

export type AddTpInput = {
  name: string;
  number: number;
  year: number;
  file: File;
};
