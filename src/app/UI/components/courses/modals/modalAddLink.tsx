// 'src/app/components/ModalImportImage.tsx'
'use client';

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
    <div className="fixed bottom-0 left-0 right-0 z-50 drop-shadow-2xl text-white flex justify-center items-center">
      <form
        className="flex flex-col max-w-80 w-11/12 bg-slate-800 p-5 rounded-lg gap-3 "
        onSubmit={(e) => (setLoading(true), handleSubmit(e))}
      >
        <div>
          <h3 className="text-lg mb-4">
            <b>{`Añadir link`}</b>
          </h3>
          <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
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
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor verifica que el link que quiere subir sea el correcto. Los
            links tienen que ser de alta prioridad. En caso de cualquier
            problema podes contactarme:{' '}
            <a
              className="underline"
              target="_blank"
              href="https://wa.me/+5492235319564"
            >
              2235319564
            </a>
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute h-6 w-6 border-x-2 rounded-full animate-spin"></div>
              <div className="h-6 w-6 border-2 opacity-40 rounded-full animate-ping"></div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <button type="submit">Agregar</button>
            <button
              type="button"
              onClick={() => (setLoading(true), callback(undefined))}
            >
              Cancelar
            </button>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
