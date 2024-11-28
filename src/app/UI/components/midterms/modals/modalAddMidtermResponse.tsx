'use client';
import { createResponseMidterm } from '@/app/lib/actions';
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
  const [typeResponse, setTypeResponse] = useState<number>();
  const [number, setNumber] = useState<number>();
  const [text, setText] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (typeResponse == undefined || typeResponse == 99) {
      setError('No se eligio un tipo de respuesta');
      return false;
    } else if (typeResponse == 0 || typeResponse == 3) {
      if (!text || text == '') {
        setError('No hay texto');
        return false;
      }
    } else if (typeResponse == 1 || typeResponse == 2) {
      if (!file) {
        setError('No hay ningun archivo seleccionado');
        return false;
      }
    }
    if (!number) {
      setError('No esta el numero del problema');
      return false;
    }
    if (!session?.user) {
      setError('Debes iniciar sesion para subir un parcial');
      return false;
    }
    return true;
  };

  const handlePDF = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type == 'application/pdf') {
        if (file.size > 1048576) {
          e.target.value = '';
          setError('El archivo pesa más de 1 MB');
        } else {
          setFile(file);
          setError(null);
        }
      } else {
        setError('Por favor selecciona un archivo .pdf');
        setFile(undefined);
        e.target.value = '';
      }
    } else {
      setFile(undefined);
    }
  };
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.split('/')[0] == 'image') {
        if (file.size > 1048576) {
          e.target.value = '';
          setError('El archivo pesa más de 1 MB');
        } else {
          setFile(file);
          setError(null);
        }
      } else {
        setError('Por favor selecciona una imagen');
        setFile(undefined);
        e.target.value = '';
      }
    } else {
      setFile(undefined);
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formValidate() &&
      session?.user?.id &&
      number &&
      typeResponse != undefined &&
      typeResponse < 10
    ) {
      try {
        const addResponse = await createResponseMidterm({
          idUser: session.user.id,
          idMidterm: midterm.id,
          number: number,
          text: text,
          type: typeResponse,
        });
        if (typeResponse == 1 || typeResponse == 2) {
          if (file) {
            if (addResponse) {
              const formData = new FormData();
              formData.set('file', file);
              formData.set('id', session.user.id.toString());
              formData.set(
                'subFolder',
                `parciales/respuestas/${midterm.id}/${number}`
              );

              await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              });
            } else {
              throw new Error('Ocurrio un error en la suba de la respuesta');
            }
          } else throw new Error('No se encontro ningun archivo');
        }
        callback(undefined);
        window.location.reload();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else setError('Ocurrio un error inesperado.');
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
          <label htmlFor="number">Número</label>
          <input
            className="text-black"
            type="number"
            name="number"
            id="number"
            placeholder={'Ingresa el numero del problema'}
            onChange={(e) => setNumber(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="type">Tipo</label>
          <select
            className="text-black"
            name="type"
            id="type"
            onChange={(e) => setTypeResponse(Number(e.target.value))}
            required
          >
            <option value="99">Selecciona el tipo respuesta</option>
            <option value="0">Texto</option>
            <option value="1">Imagen</option>
            <option value="2">Pdf</option>
            <option value="3">Código</option>
          </select>
        </div>
        {typeResponse == 0 ? (
          <div className="flex flex-col">
            <label htmlFor="text">Respuesta</label>
            <input
              className="text-black"
              type="text"
              name="text"
              id="text"
              placeholder={'Ingresa tu respuesta'}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
        ) : typeResponse == 1 ? (
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleImage(e)}
          />
        ) : typeResponse == 2 ? (
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => handlePDF(e)}
          />
        ) : typeResponse == 3 ? (
          <div className="flex flex-col text-[--black]">
            <label htmlFor="code">Respuesta</label>
            <textarea
              name="code"
              id="code"
              rows={10}
              cols={50}
              placeholder="Pega tu código aquí..."
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
        ) : null}
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
            <button aria-label="Enviar formulario" title="Enviar" type="submit">
              Enviar
            </button>
            <button
              type="button"
              aria-label="Cancelar formulario"
              title="Cancelar"
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
