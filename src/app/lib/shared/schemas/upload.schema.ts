import { file } from 'zod';

export const MAX_UPLOAD_SIZE = 5_000_000;
export const UPLOAD_SIZE_ERROR = 'El archivo debe pesar menos de 5 MB';
export const FILE_REQUIRED_ERROR = 'Debes subir un archivo';
export const PDF_ONLY_ERROR = 'Solo se admite formato PDF';
export const ID_COURSE_ERROR = 'El identificador de la materia no es válido';
export const NUMBER_ERROR = 'Debe ser un número';
export const INTEGER_ERROR = 'Debe ser un número entero';
export const NUMBER_MIN_ERROR = 'El número debe ser mayor o igual a 1';

export const pdfFileSchema = file({ message: FILE_REQUIRED_ERROR })
  .refine((f) => f.size < MAX_UPLOAD_SIZE, UPLOAD_SIZE_ERROR)
  .refine((f) => f.type === 'application/pdf', PDF_ONLY_ERROR);
