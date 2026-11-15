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
import { ModalActions, ModalContactLine, ModalFileTools, ModalNotice } from './modal-parts';

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
          required
        />
        <InputForm<AddTpInput>
          name="year"
          type="number"
          control={control}
          label="Año"
          min={2000}
          max={currentYear}
          required
        />
      </SectionForm>
      <SectionForm number={2} title="Archivo">
        <FileForm<AddTpInput> name="file" control={control} accept="application/pdf" required />
        <ModalFileTools />
      </SectionForm>
      <ModalContactLine />
      <ModalActions primaryLabel="Agregar TP" isLoading={isLoading} />
    </Form>
  );
};
