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
import { ModalContactLine, ModalFileTools, ModalNotice } from './modalParts';

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
          helper="Elegí el tipo de parcial."
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
      <SectionForm number={2} title="El archivo">
        <FileForm<AddMidtermInput>
          name="file"
          control={control}
          label="Archivo del parcial"
          accept="application/pdf"
          helper="Sólo PDF, hasta 5 MB."
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
          Agregar parcial
        </button>
      </div>
    </Form>
  );
};
