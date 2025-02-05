import { inputCheckbox } from '@/app/types';

interface Params {
  input: inputCheckbox;
  onChange: (val: boolean) => void;
}

export const InputCheckbox = ({ input, onChange }: Params) => {
  return (
    <div className="flex gap-2 items-center text-white">
      <input
        type="checkbox"
        name={input.name}
        id={input.id}
        onChange={(e) => onChange(e.target.checked)}
        required={input.required}
      />
      {input.placeholder && (
        <label htmlFor={input.name}>{input.placeholder}</label>
      )}
    </div>
  );
};
