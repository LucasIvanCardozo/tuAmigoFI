// 'src/app/components/ModalImportImage.tsx'
'use client';
import { createTp } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
// import { fetchContributor } from '@/app/lib/data';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function ModalAddTp({
  idCourse,
  callback,
}: {
  idCourse: number;
  callback: (idCourse: number | undefined) => void;
}) {
  const [nameTP, setNameTP] = useState<string | null>(null);
  const [numberTP, setNumberTP] = useState<number | null>(null);
  const [yearTP, setYearTP] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (!nameTP) {
      setError('Tienes que ingresar el nombre del TP');
      return false;
    } else if (!yearTP) {
      setError('Tienes que ingresar el año del TP');
      return false;
    }
    if (!session?.user || !session?.user.admin) {
      setError(
        'Debes iniciar sesion y ser administrador para subir una imagen'
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && session?.user?.id && nameTP && yearTP) {
      try {
        const tp = await createTp({
          name: nameTP,
          number: numberTP,
          year: yearTP,
          idUser: session.user.id,
          idCourse: idCourse,
        });
        callback(undefined);
      } catch (err) {
        setError('Ocurrio un error al llamar a la API');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed z-50 inset-0 bg-slate-800 bg-opacity-30 text-white flex justify-center items-center">
      <form
        className="flex flex-col max-w-80 w-11/12 bg-slate-800 p-5 rounded-lg gap-3 "
        onSubmit={(e) => (setLoading(true), handleSubmit(e))}
      >
        <div className="flex flex-col">
          <label htmlFor="dni">Titulo</label>
          <input
            className="text-black"
            type="text"
            name="name"
            id="name"
            placeholder={'Ingresa el titulo del TP'}
            onChange={(e) => setNameTP(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="name">Número</label>
          <input
            className="text-black"
            type="number"
            name="number"
            id="number"
            placeholder={'Ingresa el número del TP'}
            onChange={(e) => setNumberTP(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="name">Año</label>
          <input
            className="text-black"
            type="number"
            name="year"
            id="year"
            placeholder={'Ingresa el año del TP'}
            required
            onChange={(e) => setYearTP(Number(e.target.value))}
          />
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que el TP que quieres agregar no se encuentre
            ya disponible en la lista. En caso de cualquier problema podes
            contactarme:{' '}
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
            <button type="submit">Enviar</button>
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
