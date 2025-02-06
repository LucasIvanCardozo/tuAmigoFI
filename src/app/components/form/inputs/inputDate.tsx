import { inputDate } from '@/app/assets/types';

interface Params {
  input: inputDate;
  onChange: (val: Date) => void;
}

export const InputDate = ({ input, onChange }: Params) => {
  return (
    <input
      type="date"
      id={input.id}
      name={input.name}
      required={input.required}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  );
};
