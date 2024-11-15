// 'src/app/components/ModalImportImage.tsx'
'use client';
import { addResponseMidterm, createMidterm } from '@/app/lib/actions';
import { midterms } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function ModalAddMidtermResponse({
  midterm,
  callback,
}: {
  midterm: midterms;
  callback: (midterm: midterms | undefined) => void;
}) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (!file) {
      setError('No hay ningun archivo seleccionado');
      return false;
    }
    if (
      !session?.user
      // || session?.user.tier == 0
    ) {
      setError('Debes iniciar sesion para subir un parcial');
      return false;
    }
    return true;
  };

  const handlePDF = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1048576) {
        e.target.value = '';
        setError('El archivo pesa más de 1 MB');
      } else {
        setFile(file);
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && session?.user?.id && file) {
      try {
        const addResponse = await addResponseMidterm({
          idUser: session.user.id,
          idMidterm: midterm.id,
        });
        if (midterm) {
          const formData = new FormData();
          formData.set('file', file);
          formData.set('id', midterm.id.toString());
          formData.set('subFolder', 'respuestas');

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          callback(undefined);
        } else {
          setError('Ocurrio un error en la suba de la respuesta');
        }
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
        <input
          type="file"
          accept="application/pdf"
          required
          onChange={(e) => handlePDF(e)}
        />
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que las respuestas estén legibles y sean para
            este parcial. En caso de cualquier problema podes contactarme:{' '}
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
