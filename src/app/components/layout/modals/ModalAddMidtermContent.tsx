'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { createMidterm } from '@/app/lib/server/actions/midterms/create.action';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type AddMidtermInput, addMidtermSchema } from '@/app/lib/shared/schemas';
import { CheckboxForm, FileForm, Form, InputForm, SectionForm, SelectForm } from '../form';
import { ModalActions, ModalContactLine, ModalFileTools, ModalNotice } from './modal-parts';

export const ModalAddMidtermContent = ({ course }: { course: Course }) => {
  const { data: session } = useSession();
  const { control, handleSubmit } = useForm<AddMidtermInput>({
    resolver: zodResolver(addMidtermSchema),
    defaultValues: { name: '', date: '', withoutAnswers: false },
  });

  const action: SubmitHandler<AddMidtermInput> = async (data) => {
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const { error } = await createMidterm({
      name: data.name,
      date: new Date(data.date).toISOString(),
      idCourse: course.id,
      file: data.file,
      withoutAnswers: data.withoutAnswers,
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
      <SectionForm number={1} title="Datos del parcial">
        <SelectForm<AddMidtermInput>
          name="name"
          control={control}
          label="Tipo de parcial"
          placeholder="Selecciona el tipo de parcial"
          required
        >
          <option value="Primer parcial">Primer parcial</option>
          <option value="Segundo parcial">Segundo parcial</option>
          <option value="Tercer parcial">Tercer parcial</option>
          <option value="Final">Final</option>
          <option value="Otros">Otros</option>
        </SelectForm>
        <InputForm<AddMidtermInput>
          name="date"
          type="date"
          control={control}
          label="Fecha"
          helper="El día en que se tomó el parcial."
          required
        />
      </SectionForm>
      <SectionForm number={2} title="Archivo">
        <FileForm<AddMidtermInput>
          name="file"
          control={control}
          accept="application/pdf"
          required
        />
        <ModalFileTools />
        <CheckboxForm<AddMidtermInput>
          name="withoutAnswers"
          control={control}
          label="Confirmo que este PDF es sólo el parcial y no tiene las respuestas"
          helper="Si tu PDF tiene las respuestas unidas, podés subirlas después en la sección de respuestas del parcial."
          required
        />
      </SectionForm>
      <ModalContactLine />
      <ModalActions primaryLabel="Agregar parcial" isLoading={isLoading} />
    </Form>
  );
};
