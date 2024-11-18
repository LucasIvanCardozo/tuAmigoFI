// 'src/app/components/ModalImportImage.tsx'
'use client';

import { deleteMidterm, deleteMidtermResponse } from '@/app/lib/actions';
import { midterms } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function ModalDeleteMidtermResponse({
  midterm,
  callback,
}: {
  midterm: midterms;
  callback: (midterm: midterms | undefined) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (!session?.user || session?.user.tier < 2) {
      setError('Debes iniciar sesion y ser administrador para eliminar un TP');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && session && session?.user?.tier == 2) {
      try {
        const formData = new FormData();
        formData.set('id', midterm.id.toString());
        formData.set('subFolder', 'respuestas');

        const response = await fetch('/api/destroy', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const deleteMidterms = await deleteMidtermResponse({
            id: midterm.id,
          });
          callback(undefined);
          window.location.reload();
        } else {
          throw new Error('Error el na eliminacion el cloudinary');
        }
      } catch (err) {
        setError('Ocurrio un error al querer eliminar el parcial');
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
        <div>
          <h3 className="text-lg mb-4">
            <b>Estas por eliminar una respuesta</b>
          </h3>
          <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
            <p>
              <b>Nombre:</b>
              {midterm.name}
            </p>
            <p>
              <b>Fecha:</b>
              {`${midterm.date.getMonth()}/${midterm.date.getFullYear()}`}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que la respuesta a el parcial que quieres
            eliminar sea la correcta. En caso de cualquier problema podes
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
            <button type="submit">Eliminar</button>
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
