// 'src/app/components/ModalImportImage.tsx'
'use client';
import { createMidterm } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function ModalAddMidterm({
  idCourse,
  callbackAddMidterm,
}: {
  idCourse: number;
  callbackAddMidterm: (idCourse: number | undefined) => void;
}) {
  const [file, setFile] = useState<File>();
  const [nameMidterm, setNameMidterm] = useState<string | null>(null);
  const [dateMidterm, setDateMidterm] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (!nameMidterm) {
      setError('Tienes que ingresar el nombre del parcial');
      return false;
    } else if (!dateMidterm) {
      setError('Tienes que ingresar la fecha del parcial');
    } else if (!file) {
      setError('No hay ningun archivo seleccionado');
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formValidate() &&
      session?.user?.id &&
      nameMidterm &&
      dateMidterm &&
      file
    ) {
      try {
        const midterm = await createMidterm({
          name: nameMidterm,
          date: dateMidterm,
          idCourse: idCourse,
          idUser: session.user.id,
        });
        if (midterm) {
          const formData = new FormData();
          formData.set('file', file);
          formData.set('id', midterm.id.toString());
          formData.set('subFolder', 'parciales/problemas');

          await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          callbackAddMidterm(undefined);
          window.location.reload();
        } else {
          throw new Error(
            'Ocurrio un error en la suba del PDF a la base de datos'
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ocurrio un error inesperado');
        }
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
          <label htmlFor="name">Título</label>
          <select
            className="text-black"
            name="name"
            id="name"
            onChange={(e) => setNameMidterm(e.target.value)}
            required
          >
            <option hidden>Selecciona el tipo de parcial</option>
            <option value="Primer parcial">Primer parcial</option>
            <option value="Segundo parcial">Segundo parcial</option>
            <option value="Tercer Parcial">Tercer Parcial</option>
            <option value="Final">Final</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="date">Fecha</label>
          <input
            className="text-black"
            type="date"
            name="date"
            id="date"
            placeholder={'Ingresa la fecha de el parcial'}
            required
            onChange={(e) => setDateMidterm(new Date(e.target.value))}
          />
        </div>
        <input
          type="file"
          accept="application/pdf"
          required
          onChange={(e) => handlePDF(e)}
        />
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que el parcial que quieres agregar no se
            encuentre ya disponible en la lista. En caso de cualquier problema
            podes contactarme:{' '}
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
              onClick={() => (setLoading(true), callbackAddMidterm(undefined))}
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
