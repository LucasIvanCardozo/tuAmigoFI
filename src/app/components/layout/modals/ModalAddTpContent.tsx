'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { createTp } from '@/app/lib/server/actions/tps/create.action';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type AddTpInput, addTpSchema } from '@/app/lib/shared/schemas';
import { FileForm, Form, InputForm, SectionForm } from '../form';
import { ModalContactLine, ModalFileTools, ModalNotice } from './modalParts';

export const ModalAddTpContent = ({ course }: { course: Course }) => {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();
  const { control, handleSubmit } = useForm<AddTpInput>({
    resolver: zodResolver(addTpSchema),
    defaultValues: { name: '', number: 1, year: currentYear },
  });

  const action: SubmitHandler<AddTpInput> = async (data) => {
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const { error } = await createTp({
      name: data.name,
      number: data.number,
      year: data.year,
      idCourse: course.id,
      file: data.file,
    });
    if (error) throw new Error(`Error: ${error}`);
  };

  const { closeModal } = useModal();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Muchas gracias por tu aporte! ❤️',
    onSuccess: async () => {
      closeModal();
    },
  });

  return (
    <Form onSubmit={handleSubmit(submit)} noValidate>
      <ModalNotice>
        <strong className="font-bold text-white">No dupliques el archivo:</strong> revisá la lista
        de la materia antes de subir.
      </ModalNotice>
      <SectionForm number={1} title="Datos del TP">
        <InputForm<AddTpInput>
          name="name"
          control={control}
          label="Título del TP"
          helper="El nombre que ven tus compañeros en la lista."
          required
        />
        <InputForm<AddTpInput>
          name="number"
          type="number"
          control={control}
          label="TP N°"
          min={1}
          max={30}
          helper="De 1 a 30."
          required
        />
        <InputForm<AddTpInput>
          name="year"
          type="number"
          control={control}
          label="Año"
          min={2000}
          max={currentYear}
          helper={`De 2000 a ${currentYear}.`}
          required
        />
      </SectionForm>
      <SectionForm number={2} title="El archivo">
        <FileForm<AddTpInput>
          name="file"
          control={control}
          label="Archivo del TP"
          accept="application/pdf"
          helper="Sólo PDF, hasta 5 MB."
          required
        />
        <ModalFileTools />
      </SectionForm>
      <ModalContactLine />
      <div className="flex items-center justify-end gap-3 border-t border-slate-700 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md border-2 border-[#92C1C9] bg-[#92C1C9] px-4 py-2 text-sm font-semibold text-(--black) transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar TP
        </button>
      </div>
    </Form>
  );
};
