import { ReactNode } from 'react';

export type TypeResponse = '' | '0' | '1' | '2' | '3';

export interface TypeValues {
  id: string;
  value: string | boolean | File | undefined | TypeResponse | Date;
  inputType: string;
  validate: boolean;
}

export interface DataForm {
  children: ReactNode;
  title: string;
  onSubmit: (values: TypeValues[]) => Promise<void>;
}
