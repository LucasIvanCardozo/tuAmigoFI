import { TypeValues } from '@/app/types';
import { createContext, useContext } from 'react';

interface TypeFromContext {
  values: TypeValues[];
  setValues: React.Dispatch<React.SetStateAction<TypeValues[]>>;
}

export const FormContext = createContext<TypeFromContext>({
  values: [],
  setValues: () => {},
});

export const useFormContext = () => useContext(FormContext);
