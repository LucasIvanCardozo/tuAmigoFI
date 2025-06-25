// 'src/app/components/ModalImportImage.tsx'
'use client';
import { MainModal } from '@/app/components/modals/mainModal';
import { Loading } from '@/app/components/others/loading';
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
    <MainModal
      children={
        <form
          className="relative flex flex-col w-full"
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
              estar presente en la página. En caso de cualquier problema podes
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
          <div className="flex justify-center">
            {loading ? (
              <Loading size={6} mode="white" />
            ) : (
              <button
                className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700  transition-colors"
                type="submit"
              >
                Eliminar
              </button>
            )}
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      }
      closeModal={() => callback(undefined)}
    />
  );
}
