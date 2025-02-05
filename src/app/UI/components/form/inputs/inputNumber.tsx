import { inputNumber } from '@/app/types';

interface Params {
  input: inputNumber;
  onChange: (val: string) => void;
}
export const InputNumber = ({ input, onChange }: Params) => {
  return (
    <input
      id={input.id}
      name={input.name}
      type={input.type}
      min={input.min}
      max={input.max}
      placeholder={input.placeholder}
      required={input.required}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
