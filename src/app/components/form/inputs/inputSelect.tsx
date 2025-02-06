import { inputSelect, TypeInput } from '@/app/assets/types';

interface Params {
  input: inputSelect;
  onChange: (val: string) => void;
}
export const InputSelect = ({ input, onChange }: Params) => {
  return (
    <select
      name={input.name}
      id={input.id}
      required={input.required}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{input.placeholder}</option>
      {input.children}
    </select>
  );
};
