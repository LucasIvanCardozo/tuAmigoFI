'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { use } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/contexts/ModalContext';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { useReload } from '@/app/hooks/useReload';
import { createCorrelative } from '@/app/lib/server/actions/correlatives/create.action';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type AddCorrelativeInput, addCorrelativeSchema } from '@/app/lib/shared/schemas';
import { Form, SelectForm } from '../form';

export const ModalCreateCorrelativeContent = ({
  course,
  callback,
}: {
  course: Course;
  callback: Promise<Pick<Course, 'id' | 'name'>[]>;
}) => {
  const { data: session } = useSession();
  const courses = use(callback);
  const { control, handleSubmit } = useForm<AddCorrelativeInput>({
    resolver: zodResolver(addCorrelativeSchema),
    defaultValues: { idCorrelative: '' },
  });

  const action: SubmitHandler<AddCorrelativeInput> = async (data) => {
    if (!session) throw new Error('Necesitas iniciar sesion!');
    if (session.user.tier === 0)
      throw new Error('Debes tener un rango superior para añadir correlativas');
    const { error } = await createCorrelative({
      idCourse: course.id,
      idCorrelativeCourse: data.idCorrelative,
    });
    if (error) throw new Error(error);
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
      <h3 className="text-lg mb-4">
        <b>Añadir correlativa</b>
      </h3>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <SelectForm<AddCorrelativeInput>
          name="idCorrelative"
          control={control}
          label="Correlativa"
          placeholder={courses ? 'Selecciona la materia correlativa' : 'Cargando...'}
          required
        >
          {courses?.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </SelectForm>
        <div className="my-2">
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor verifica que el link que quiere subir sea el correcto. Los links tienen que
            ser de alta prioridad. En caso de cualquier problema podes contactarme:{' '}
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
