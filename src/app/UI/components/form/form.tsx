import { FormContext } from '@/app/lib/contexts';
import { DataForm, TypeValues } from '@/app/types';
import { FormEvent, useState } from 'react';
import { Loading } from '../others/loading';

export const Form = ({ children, onSubmit, onEnd }: DataForm) => {
  const [values, setValues] = useState<TypeValues[]>([]);
  const [loading, setLoading] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!values.some((val) => !val.validate)) {
        await onSubmit(values);
        setLoading(false);
        setThanks(true);
        if (onEnd) {
          setTimeout(() => {
            onEnd();
          }, 1200);
        }
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
    <FormContext.Provider value={{ values, setValues }}>
      <form
        className="relative flex flex-col"
        onSubmit={(e) => handleSubmit(e)}
      >
        {children}
        {values.some((val) => !val.validate) ? 'Falta algo.' : 'Correcto!'}
        {error && <p className="text-red-500">{`Error: ${error}`}</p>}
        <div className="flex gap-4 justify-center">
          {thanks ? (
            <p>Muchas gracias por tu aporte! ❤️</p>
          ) : loading ? (
            <Loading size={6} mode={1} />
          ) : (
            <button type="submit">Aceptar</button>
          )}
        </div>
      </form>
    </FormContext.Provider>
  );
};
