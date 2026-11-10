import { z } from 'zod';
import {
  FILE_REQUIRED_ERROR,
  MAX_UPLOAD_SIZE,
  NUMBER_ERROR,
  NUMBER_MIN_ERROR,
  UPLOAD_SIZE_ERROR,
} from './upload.schema';

export const RESPONSE_TYPE_ERROR = 'Selecciona el tipo de respuesta';
export const RESPONSE_TEXT_ERROR = 'Debes escribir tu respuesta';
export const RESPONSE_BOOLEAN_ERROR = 'Debe ser verdadero o falso';
export const RESPONSE_FILE_TYPES_ERROR = 'Solo se admite PDF, JPEG o PNG';
export const RESPONSE_ID_TP_ERROR = 'El identificador del TP no es válido';
export const RESPONSE_ID_MIDTERM_ERROR = 'El identificador del parcial no es válido';
export const RESPONSE_TARGET_ERROR = 'Debe existir idTp o idMidterm, pero no ambos';

export const responseFileSchema = z
  .file({ message: FILE_REQUIRED_ERROR })
  .refine((f) => f.size < MAX_UPLOAD_SIZE, UPLOAD_SIZE_ERROR)
  .refine(
    (f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'application/pdf',
    RESPONSE_FILE_TYPES_ERROR,
  );

export const getResponseFileTypeError = (type: string, file?: File | null): string | null => {
  if (!file) return null;
  if (type === 'IMAGE') {
    return file.type === 'image/jpeg' || file.type === 'image/png'
      ? null
      : 'Para una imagen selecciona un archivo JPG o PNG';
  }
  if (type === 'PDF') {
    return file.type === 'application/pdf' ? null : 'Para un PDF selecciona un archivo PDF';
  }
  return null;
};

export const getResponseNumberError = (
  value: number | undefined,
  allProblems: boolean,
): string | null => {
  if (allProblems) return null;
  if (value === undefined || !Number.isInteger(value)) return NUMBER_ERROR;
  if (value < 1) return NUMBER_MIN_ERROR;
  if (value > 100) return 'Número fuera de rango';
  return null;
};

export const addResponseSchema = z
  .object({
    number: z.number({ message: NUMBER_ERROR }).optional(),
    type: z.enum(['TEXT', 'CODE', 'IMAGE', 'PDF'], { message: RESPONSE_TYPE_ERROR }),
    text: z.string({ message: RESPONSE_TEXT_ERROR }).optional(),
    file: responseFileSchema.optional(),
    allProblems: z.boolean({ message: RESPONSE_BOOLEAN_ERROR }),
  })
  .superRefine((data, ctx) => {
    const numberError = getResponseNumberError(data.number, data.allProblems);
    if (numberError) {
      ctx.addIssue({
        code: 'custom',
        path: ['number'],
        message: numberError,
      });
    }

    if ((data.type === 'TEXT' || data.type === 'CODE') && !data.text) {
      ctx.addIssue({
        code: 'custom',
        path: ['text'],
        message: RESPONSE_TEXT_ERROR,
      });
    }
    if ((data.type === 'IMAGE' || data.type === 'PDF') && !data.file) {
      ctx.addIssue({
        code: 'custom',
        path: ['file'],
        message: FILE_REQUIRED_ERROR,
      });
    }
    const fileTypeError = getResponseFileTypeError(data.type, data.file);
    if (fileTypeError) {
      ctx.addIssue({
        code: 'custom',
        path: ['file'],
        message: fileTypeError,
      });
    }
  });

export const addResponseActionSchema = z
  .object({
    idTp: z.cuid({ message: RESPONSE_ID_TP_ERROR }).nullable().optional(),
    idMidterm: z.cuid({ message: RESPONSE_ID_MIDTERM_ERROR }).nullable().optional(),
    number: z.number({ message: NUMBER_ERROR }).optional(),
    allProblems: z.boolean({ message: RESPONSE_BOOLEAN_ERROR }).optional(),
    type: z.enum(['TEXT', 'CODE', 'IMAGE', 'PDF'], { message: RESPONSE_TYPE_ERROR }),
    text: z
      .string({ message: RESPONSE_TEXT_ERROR })
      .min(1, RESPONSE_TEXT_ERROR)
      .nullable()
      .optional(),
    file: responseFileSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const hasTp = Boolean(data.idTp);
    const hasMid = Boolean(data.idMidterm);

    if (hasTp === hasMid) {
      ctx.addIssue({
        code: 'custom',
        message: RESPONSE_TARGET_ERROR,
      });
    }

    const numberError = getResponseNumberError(data.number, data.allProblems === true);
    if (numberError) {
      ctx.addIssue({
        code: 'custom',
        path: ['number'],
        message: numberError,
      });
    }

    const fileTypeError = getResponseFileTypeError(data.type, data.file);
    if (fileTypeError) {
      ctx.addIssue({
        code: 'custom',
        path: ['file'],
        message: fileTypeError,
      });
    }
  });

export type AddResponseInput = z.infer<typeof addResponseSchema>;
