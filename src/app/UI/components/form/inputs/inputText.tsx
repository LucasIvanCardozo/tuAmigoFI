import { inputText } from '@/app/types';

interface Params {
  input: inputText;
  onChange: (val: string) => void;
}

export const InputText = ({ input, onChange }: Params) => {
  return (
    <input
      id={input.id}
      name={input.name}
      type={input.type}
      placeholder={input.placeholder}
      required={input.required}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
