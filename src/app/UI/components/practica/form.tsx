import { FormContext, useMainContext } from '@/app/lib/context';
import { DataForm, TypeValues } from '@/app/types';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Loading } from './loading';

export const Form = () => {
  const [values, setValues] = useState<TypeValues[]>([]);
  const { dataModal, setDataModal } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [error, setError] = useState('');

  const closeModal = () => {
    setDataModal({
      dataForm: { title: '', children: <></>, onSubmit: async () => {} },
      viewModal: false,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!values.some((val) => !val.validate)) {
        await dataModal.dataForm.onSubmit(values);
        setLoading(false);
        setThanks(true);
        setTimeout(() => {
          closeModal();
        }, 1200);
      } else {
        throw new Error('No deberías hacer esto...');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else setError('Error inesperado');
      setLoading(false);
    }
  };

  return (
    <form
      className="relative flex flex-col max-w-lg w-11/12 max-h-screen overflow-y-auto bg-slate-800 p-5 rounded-lg gap-3 "
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2 className="text-lg">{dataModal.dataForm.title}</h2>
      <FormContext.Provider value={{ values, setValues }}>
        {dataModal.dataForm.children}
      </FormContext.Provider>
      {values.some((val) => !val.validate) ? 'Falta algo.' : 'Correcto!'}
      {error && <p className="text-red-500">{`Error: ${error}`}</p>}
      <div className="flex gap-4 justify-center">
        {thanks ? (
          <p>Muchas gracias por tu aporte! ❤️</p>
        ) : loading ? (
          <Loading size={6} mode={1} />
        ) : (
          <>
            <button onClick={closeModal}>Cancelar</button>
            <button type="submit">Aceptar</button>
          </>
        )}
      </div>
    </form>
  );
};
