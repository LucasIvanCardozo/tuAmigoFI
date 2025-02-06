// 'src/app/components/ModalImportImage.tsx'
'use client';
import { addReportLink, deleteLink } from '@/app/lib/actions';
import { links } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function ModalDeleteLink({
  link,
  callback,
}: {
  link: links;
  callback: (link: links | undefined) => void;
}) {
  const [check, setCheck] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formValidate = (): boolean => {
    if (!check) {
      setError('Debes estar de acuerdo con la eliminacion del link');
      return false;
    }
    if (!session?.user || session.user.tier != 2) {
      setError(
        'Debes iniciar sesion y ser administrador para eliminar un link'
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate() && session && session.user.tier == 2) {
      try {
        await deleteLink({ id_link: link.id });
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
            <b>{`Eliminar link`}</b>
          </h3>
          <div className="flex flex-col gap-1 [&>*]:flex [&>*]:gap-1">
            <span>
              <b>Nombre:</b>
              {link.name}
            </span>
            <span>
              <b>Link:</b>
              <a href={link.link} className="hover:underline">
                {link.link}
              </a>
            </span>
            <div>
              <input
                type="checkbox"
                name="check"
                id="check"
                onChange={(e) => setCheck(e.target.checked)}
                required
              />
              <label htmlFor="check">Quiero eliminarlo</label>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor elimine el link solo si considera que este no debería
            estar presente en la pagina. En caso de cualquier problema podes
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
            <button aria-label="Eliminar link" title="Eliminar" type="submit">
              Eliminar
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
