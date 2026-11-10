import { boolean, cuid, object, string } from 'zod';
import { ID_COURSE_ERROR, pdfFileSchema } from './upload.schema';

export const WITHOUT_ANSWERS_ERROR = 'Tenés que confirmar que el parcial no tiene las respuestas';
export const MIDTERM_TYPE_ERROR = 'Elegí el tipo de parcial';
export const MIDTERM_DATE_ERROR = 'La fecha es obligatoria';

export const withoutAnswersSchema = boolean({ message: WITHOUT_ANSWERS_ERROR }).refine(
  (value) => value,
  WITHOUT_ANSWERS_ERROR,
);

export const addMidtermSchema = object({
  name: string({ message: MIDTERM_TYPE_ERROR }).min(1, MIDTERM_TYPE_ERROR),
  date: string({ message: MIDTERM_DATE_ERROR }).min(1, MIDTERM_DATE_ERROR),
  file: pdfFileSchema,
  withoutAnswers: withoutAnswersSchema,
});

export const addMidtermActionSchema = addMidtermSchema.extend({
  idCourse: cuid({ message: ID_COURSE_ERROR }),
});

export type AddMidtermInput = {
  name: string;
  date: string;
  file: File;
  withoutAnswers: boolean;
};
