// 'src/app/components/ModalImportImage.tsx'
'use client';
import {
  AddContributor,
  createAnonymus,
  // createContributor,
} from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
// import { fetchContributor } from '@/app/lib/data';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function ModalImportImage({
  problemId,
  callback,
}: {
  problemId: number;
  callback: (problemId: number | undefined) => void;
}) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string | null>(null);
  const [anonymusCheck, setAnonymusCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
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

  const formValidate = (): boolean => {
    if (!session?.user) {
      setError('Debes iniciar sesion para subir una imagen');
      return false;
    }
    if (!file) {
      setError('No hay ningun archivo seleccionado');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && file && session?.user?.email) {
      try {
        const formData = new FormData();
        formData.set('file', file);
        formData.set('id', problemId.toString());

        //Consulta a la api
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          if (!anonymusCheck) {
            await AddContributor(problemId, session.user.id);
          } else if (anonymusCheck) {
            await createAnonymus();
            await AddContributor(problemId, 0);
          }
          callback(undefined);
        } else {
          setError('Ocurrio un error en la suba de la imagen');
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
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="check"
            id="check"
            onChange={() => setAnonymusCheck(!anonymusCheck)}
          />
          <label htmlFor="check">Quiero ser anonimo</label>
        </div>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => handleImage(e)}
        />
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
