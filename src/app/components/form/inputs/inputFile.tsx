import { inputFile } from '@/app/assets/types';
import { ChangeEvent } from 'react';

interface Params {
  input: inputFile;
  onChange: (val: ChangeEvent<HTMLInputElement>) => void;
}
export const InputFile = ({ input, onChange }: Params) => {
  return (
    <input
      className="text-white"
      type="file"
      accept={input.accept}
      required={input.required}
      onChange={(e) => onChange(e)}
    />
  );
};
