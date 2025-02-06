import { ReactNode } from 'react';

export type TypeResponse = '' | '0' | '1' | '2' | '3';

export interface TypeValues {
  id: string;
  value: string | boolean | File | undefined | TypeResponse | Date;
  inputType: string;
  validate: boolean;
}

export interface DataForm {
  children: ReactNode; // Todos los inputs + submits que estarán dentro del formulario
  onSubmit: (values: TypeValues[]) => Promise<void>; // Se ejecuta una vez se hace submit al formulario
  onEnd?: () => void; //Se ejecuta una vez terminan todas las acciones del formulario
}
