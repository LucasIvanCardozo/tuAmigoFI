// 'src/app/components/ModalImportImage.tsx'
'use client';
import {
  AddContributor,
  createAnonymus,
  createContributor,
} from '@/app/lib/actions';
import { fetchContributor } from '@/app/lib/data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function ModalImportImage({ imageId }: { imageId: string }) {
  const [file, setFile] = useState<File>();
  const [nameUser, setNameUser] = useState<string>();
  const [dniUser, setDniUser] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [anonymusCheck, setAnonymusCheck] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('importImage');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //validacion de datos
    if (!anonymusCheck) {
      if (!nameUser) {
        setError('Tienes que ingresar tu nombre');
        return;
      } else if (!dniUser) {
        setError('Tienes que inmgresar tu DNI');
        return;
      }
    }
    if (!file) {
      setError('No hay ningun archivo seleccionado');
      return;
    }

    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('id', imageId);

      //Consulta a la api
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        if (!anonymusCheck && nameUser && dniUser) {
          const contributor = await fetchContributor(dniUser);
          if (contributor == null) await createContributor(dniUser, nameUser);
          await AddContributor(Number(imageId), dniUser);
        } else if (anonymusCheck) {
          await createAnonymus();
          await AddContributor(Number(imageId), '00000000');
        }
        handleCancel();
      } else {
        setError(result.error || 'Ocurrio un error');
      }
    } catch (err) {
      setError('Ocurrio un error al subir la imagen');
    }
  };
  return (
    <div className="fixed z-50 inset-0 bg-slate-800 bg-opacity-30 text-white flex justify-center items-center">
      <form
        className="flex flex-col bg-slate-800 p-5 rounded-lg gap-3"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Ingresa tu nombre"
          onChange={(e) => setNameUser(e.target.value)}
          required={!anonymusCheck}
          disabled={anonymusCheck}
        />
        <label htmlFor="dni">Dni</label>
        <input
          type="text"
          name="dni"
          id="dni"
          placeholder="Ingresa tu DNI"
          onChange={(e) => setDniUser(e.target.value)}
          required={!anonymusCheck}
          disabled={anonymusCheck}
        />
        <input
          type="checkbox"
          name="check"
          id="check"
          onChange={() => setAnonymusCheck(!anonymusCheck)}
        />
        <label htmlFor="check">Quiero ser anonimo</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0])}
        />

        <button type="button" onClick={handleCancel}>
          Cancelar
        </button>
        <button type="submit">Enviar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
