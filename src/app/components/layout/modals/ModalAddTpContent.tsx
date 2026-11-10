'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  HiOutlineDocumentArrowUp,
  HiOutlineInformationCircle,
  HiOutlineScissors,
} from 'react-icons/hi2';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { createTp } from '@/app/lib/server/actions/tps/create.action';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type AddTpInput, addTpSchema } from '@/app/lib/shared/schemas';
import { FileForm, Form, InputForm, SectionForm } from '../form';

const Notice = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2 rounded-lg bg-(--midnight-green) p-3">
    <HiOutlineInformationCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
    <p className="text-xs font-medium text-(--silver)">{children}</p>
  </div>
);

const FileTools = () => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-wrap gap-2">
      <a
        href="https://www.ilovepdf.com/es/eliminar-paginas"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-700"
      >
        <HiOutlineScissors aria-hidden="true" className="h-4 w-4" />
        Eliminar páginas
      </a>
      <a
        href="https://tools.pdf24.org/es/convertidor-pdf"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-700"
      >
        <HiOutlineDocumentArrowUp aria-hidden="true" className="h-4 w-4" />
        Convertir a PDF
      </a>
    </div>
    <p className="text-xs text-(--silver)">iLovePDF y PDF24: se abren en otra pestaña.</p>
  </div>
);

const ContactLine = () => (
  <p className="text-xs text-(--silver)">
    ¿Algún problema con la carga? Escribinos por WhatsApp:{' '}
    <a
      href="https://wa.me/+5492235319564"
      target="_blank"
      rel="noopener"
      className="font-semibold text-white underline"
    >
      2235319564
    </a>
  </p>
);

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
      <Notice>
        <strong className="font-bold text-white">No dupliques el archivo:</strong> revisá la lista
        de la materia antes de subir.
      </Notice>
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
        <FileTools />
      </SectionForm>
      <ContactLine />
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
