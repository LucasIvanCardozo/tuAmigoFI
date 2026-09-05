import { z } from 'zod';

const responseFileSchema = z
  .instanceof(File)
  .refine((f) => f.size < 5_000_000, 'El archivo debe pesar menos de 5 MB')
  .refine(
    (f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'application/pdf',
    'Solo se admite PDF, JPEG o PNG',
  );

export const addResponseSchema = z
  .object({
    number: z
      .number({ message: 'Debe ser un número' })
      .int()
      .min(1, 'El número debe ser mayor o igual a 1')
      .max(100, 'Número fuera de rango'),
    type: z.enum(['TEXT', 'CODE', 'IMAGE', 'PDF'], {
      message: 'Selecciona el tipo de respuesta',
    }),
    text: z.string().optional(),
    file: responseFileSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if ((data.type === 'TEXT' || data.type === 'CODE') && !data.text) {
      ctx.addIssue({
        code: 'custom',
        path: ['text'],
        message: 'Debes escribir tu respuesta',
      });
    }
    if ((data.type === 'IMAGE' || data.type === 'PDF') && !data.file) {
      ctx.addIssue({
        code: 'custom',
        path: ['file'],
        message: 'Debes subir un archivo',
      });
    }
  });

export type AddResponseInput = z.infer<typeof addResponseSchema>;
