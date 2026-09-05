'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { useReload } from '@/app/hooks/useReload';
import { createTp } from '@/app/lib/server/actions/tps/create.action';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type AddTpInput, addTpSchema } from '@/app/lib/shared/schemas';
import { FileForm, Form, InputForm, SectionForm } from '../form';

export const ModalAddTpContent = ({ course }: { course: Course }) => {
  const { data: session } = useSession();
  const { control, handleSubmit } = useForm<AddTpInput>({
    resolver: zodResolver(addTpSchema),
    defaultValues: { name: '', number: 1, year: new Date().getFullYear() },
  });

  const action: SubmitHandler<AddTpInput> = async (data) => {
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const { error } = await createTp({
      name: data.name,
      number: data.number,
      year: data.year,
      idUser: session.user.id,
      idCourse: course.id,
      file: data.file,
    });
    if (error) throw new Error(`Error: ${error}`);
  };

  const { closeModal } = useModal();
  const { startReload } = useReload();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Muchas gracias por tu aporte! ❤️',
    onSuccess: async () => {
      startReload();
      closeModal();
    },
  });

  return (
    <>
      <h2 className="text-lg">Agregar TP</h2>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <SectionForm title="Datos del TP">
          <InputForm<AddTpInput>
            name="name"
            control={control}
            label="Título"
            placeholder="Título del TP"
            required
          />
          <InputForm<AddTpInput>
            name="number"
            type="number"
            control={control}
            label="Número"
            placeholder="Número del TP"
            min={1}
            max={30}
            required
          />
          <InputForm<AddTpInput>
            name="year"
            type="number"
            control={control}
            label="Año"
            placeholder="Año del TP"
            min={2000}
            max={new Date().getFullYear()}
            required
          />
        </SectionForm>
        <FileForm<AddTpInput>
          name="file"
          control={control}
          label="Archivo (PDF)"
          accept="application/pdf"
          required
        />
        <div>
          <a
            href="https://www.ilovepdf.com/es/eliminar-paginas"
            target="_blank"
            className="underline"
            rel="noopener"
          >
            <h3 className="text-sm">Click aquí para eliminar páginas de tu PDF</h3>
          </a>
        </div>
        <div>
          <a
            href="https://tools.pdf24.org/es/convertidor-pdf"
            target="_blank"
            className="underline"
            rel="noopener"
          >
            <h3 className="text-sm">Click aquí para convertir a PDF</h3>
          </a>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Solo se admite formato PDF y solo con los problemas (sin las respuestas). Por favor
            asegurate de que el modulo que quieres agregar no se encuentre ya disponible en la
            lista. En caso de cualquier problema podes contactarme:{' '}
            <a
              className="underline"
              target="_blank"
              href="https://wa.me/+5492235319564"
              rel="noopener"
            >
              2235319564
            </a>
          </p>
        </div>
        <div className="flex gap-4 justify-center mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aceptar
          </button>
        </div>
      </Form>
    </>
  );
};
