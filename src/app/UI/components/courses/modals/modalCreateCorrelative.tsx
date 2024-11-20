// 'src/app/components/ModalImportImage.tsx'
'use client';

import { addLink, createCorrelative, deleteMidterm } from '@/app/lib/actions';
import { fetchAllCourses, fetchCourse, fetchCourses } from '@/app/lib/data';
import { courses, midterms } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';

export default function ModalCreateCorrelative({
  course,
  callback,
}: {
  course: courses;
  callback: (course: courses | undefined) => void;
}) {
  const [idCorrelative, setIdCorrelative] = useState<number | undefined>();
  const [courses, setCourses] = useState<
    {
      id: number;
      name: string;
    }[]
  >();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetch = async () => {
      const coursesAux = await fetchAllCourses();
      setCourses(coursesAux);
    };
    fetch();
  }, []);

  const formValidate = (): boolean => {
    if (!idCorrelative) {
      setError('Tenes que ponerle un nomber al link');
      return false;
    }
    if (!session?.user || session?.user.tier < 1) {
      setError('Debes iniciar sesion y ser administrador para eliminar un TP');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && session && session?.user?.tier > 0 && idCorrelative) {
      try {
        await createCorrelative({
          id: course.id,
          id_correlative: idCorrelative,
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
              <label htmlFor="correlative">Correlativa</label>
              <select
                className="text-black"
                name="correlative"
                id="correlative"
                onChange={(e) => setIdCorrelative(Number(e.target.value))}
                required
              >
                {courses ? (
                  <>
                    <option hidden>Selecciona la materia correlativa</option>
                    {courses.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option hidden>Cargando...</option>
                )}
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
