// 'src/app/components/ModalImportImage.tsx'
'use client';
import { addReportMidterm, addReportTp } from '@/app/lib/actions';
import { midterms, tps, tps_responses } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function ModalReportMidterm({
  midterm,
  callback,
}: {
  midterm: midterms;
  callback: (midterm: midterms | undefined) => void;
}) {
  const [check, setCheck] = useState<boolean>();
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (!check) {
      setError('Debes estar de acuerdo el reporte a este Parcial');
      return false;
    }
    if (!session?.user) {
      setError('Debes iniciar sesion y reportar un Parcial');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && session) {
      try {
        await addReportMidterm({
          id_midterm: midterm.id,
          id_user: session.user.id,
        });
        setConfirmed(true);
        setTimeout(() => {
          callback(undefined);
        }, 1200);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else setError('Ocurrio un error inesperado');
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
            <b>{`Reportar TP`}</b>
          </h3>
          <div className="flex flex-col gap-1 [&>*]:flex [&>*]:gap-1">
            <span>
              <b>Nombre:</b>
              {midterm.name}
            </span>
            <div>
              <input
                type="checkbox"
                name="check"
                id="check"
                onChange={(e) => setCheck(e.target.checked)}
                required
              />
              <label htmlFor="check">Quiero reportarlo</label>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor sea reporte el parcial solo si considera que este no
            debería estar presente en la pagina. En caso de cualquier problema
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
        {confirmed && <span>Gracias por tu reporte!</span>}
        {loading ? (
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute h-6 w-6 border-x-2 rounded-full animate-spin"></div>
              <div className="h-6 w-6 border-2 opacity-40 rounded-full animate-ping"></div>
            </div>
          </div>
        ) : (
          !confirmed && (
            <div className="flex gap-4 justify-center">
              <button
                aria-label="Reportar Parcial"
                title="Reportar"
                type="submit"
              >
                Reportar
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
          )
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
