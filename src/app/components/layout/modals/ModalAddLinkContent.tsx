'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useFormSubmit } from '@/app/hooks/useFormSubmit';
import { useReload } from '@/app/hooks/useReload';
import { createLink } from '@/app/lib/server/actions/links/create.action';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { type AddLinkInput, addLinkSchema } from '@/app/lib/shared/schemas';
import { Form, InputForm, SectionForm, SelectForm } from '../form';

export const ModalAddLinkContent = ({ course }: { course: Course }) => {
  const { data: session } = useSession();
  const { control, handleSubmit } = useForm<AddLinkInput>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: { name: '', link: '', official: false },
  });

  const action: SubmitHandler<AddLinkInput> = async (data) => {
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const { error } = await createLink({
      idCourse: course.id,
      link: data.link,
      name: data.name,
      official: data.official,
    });
    if (error) throw new Error(error);
  };

  const { startReload } = useReload();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: 'Muchas gracias por tu aporte! ❤️',
    onSuccess: async () => {
      startReload();
    },
  });

  return (
    <>
      <h2 className="text-lg mb-2">Añadir link</h2>
      <p>
        Este link será añadido a la materia <b>&quot;{course.name}&quot;</b>
      </p>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <SectionForm title="Datos del link">
          <InputForm<AddLinkInput>
            name="name"
            control={control}
            label="Título del link"
            placeholder="Ingresa el titulo del link"
            required
          />
          <InputForm<AddLinkInput>
            name="link"
            type="url"
            control={control}
            label="Link"
            placeholder="Ingresa el link"
            required
          />
          <SelectForm<AddLinkInput>
            name="official"
            control={control}
            label="Tipo de link"
            placeholder="Selecciona el tipo de link"
            required
          >
            <option value="true">Oficial</option>
            <option value="false">No oficial</option>
          </SelectForm>
        </SectionForm>
        <div className="my-2">
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor verifica que el link que quiere subir sea el correcto y no este ya disponible
            en la lista. Los links tienen que ser de alta prioridad. En caso de cualquier problema
            podes contactarme:{' '}
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
