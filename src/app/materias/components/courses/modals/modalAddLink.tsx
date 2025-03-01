// 'src/app/components/ModalImportImage.tsx'
'use client';

import { MainModal } from '@/app/components/modals/mainModal';
import { Loading } from '@/app/components/others/loading';
import { addLink } from '@/app/lib/actions';
import { courses } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function ModalAddLink({
  course,
  callback,
}: {
  course: courses;
  callback: (course: courses | undefined) => void;
}) {
  const [name, setName] = useState<string | undefined>();
  const [link, setLink] = useState<string | undefined>();
  const [official, setOfficial] = useState<boolean | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (!name) {
      setError('Tenés que ponerle un nomber al link');
      return false;
    } else if (!link) {
      setError('Tenés que poner la direccion web');
      return false;
    } else if (!link.startsWith('https://')) {
      setError('El link debe comenzar con "https://"');
      return false;
    } else if (official == undefined) {
      setError('Tenés que decir si el link es oficial o no');
      return false;
    }
    if (!session?.user) {
      setError('Debes iniciar sesion para añadir un link');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && session && name && link && official != undefined) {
      try {
        await addLink({
          idCourse: course.id,
          link: link,
          name: name,
          official: official,
          idUser: session.user.id,
        });
        callback(undefined);
        window.location.reload();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else setError('Ocurrio un error inesperado');
      }
    }
    setLoading(false);
  };

  return (
    <MainModal
      children={
        <form
          className="relative flex flex-col w-full"
          onSubmit={(e) => (setLoading(true), handleSubmit(e))}
        >
          <div>
            <h3 className="text-lg mb-2">
              <b>Añadir link</b>
            </h3>
            <p>
              Este link será añadido a la materia <b> "{course.name}"</b>
            </p>
            <div className="flex flex-col gap-2 [&>*]:flex ">
              <div className="flex flex-col">
                <label htmlFor="name">Titulo del link</label>
                <input
                  className="text-black"
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="ÑÖcompletes"
                  placeholder={'Ingresa el titulo del link'}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="link">Link</label>
                <input
                  className="text-black"
                  type="url"
                  name="link"
                  id="link"
                  autoComplete="off"
                  placeholder={'Ingresa el link'}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="official">Título</label>
                <select
                  className="text-black"
                  name="official"
                  id="official"
                  onChange={(e) => (
                    console.log(Boolean(e.target.value)),
                    setOfficial(Boolean(e.target.value))
                  )}
                  required
                >
                  <option hidden>Selecciona el tipo de link</option>
                  <option value="1">Oficial</option>
                  <option value="">No oficial</option>
                </select>
              </div>
            </div>
          </div>
          <div className="my-2">
            <h3 className="text-sm">Recuerda!</h3>
            <p className="text-xs">
              Por favor verifica que el link que quiere subir sea el correcto y
              no este ya disponible en la lista. Los links tienen que ser de
              alta prioridad. En caso de cualquier problema podes contactarme:{' '}
              <a
                className="underline"
                target="_blank"
                href="https://wa.me/+5492235319564"
              >
                2235319564
              </a>
            </p>
          </div>
          <div className="flex justify-center">
            {loading ? (
              <Loading size={6} mode="white" />
            ) : (
              <button
                className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700  transition-colors"
                type="submit"
              >
                Aceptar
              </button>
            )}
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      }
      closeModal={() => callback(undefined)}
    />
  );
}
