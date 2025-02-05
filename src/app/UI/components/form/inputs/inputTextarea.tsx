import { inputTextArea } from '@/app/types';

interface Params {
  input: inputTextArea;
  onChange: (val: string) => void;
}
export const InputTextarea = ({ input, onChange }: Params) => {
  return (
    <textarea
      id={input.id}
      name={input.name}
      rows={input.rows}
      cols={input.cols}
      placeholder={input.placeholder}
      required={input.required}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
