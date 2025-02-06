import { inputSelectResponse, TypeInput, TypeResponse } from '@/app/assets/types';
import { ChangeEvent } from 'react';

interface Params {
  input: inputSelectResponse;
  typeResponse: TypeResponse;
  onChange: (val: TypeResponse) => void;
  setValue: (val: string) => void;
  setImage: (val: ChangeEvent<HTMLInputElement>) => void;
  setPDF: (val: ChangeEvent<HTMLInputElement>) => void;
}
export const InputSelectResponse = ({
  input,
  onChange,
  setValue,
  setImage,
  setPDF,
  typeResponse,
}: Params) => {
  return (
    <>
      <div className="flex flex-col">
        <label className="text-white" htmlFor={input.name}>
          Tipo de respuesta
        </label>
        <select
          className="text-black mb-2"
          name={input.name}
          id={input.id}
          onChange={(e) => onChange(e.target.value as TypeResponse)}
          required
        >
          <option value="">Selecciona el tipo respuesta</option>
          <option value="0">Texto</option>
          <option value="1">Imagen</option>
          <option value="2">Pdf</option>
          <option value="3">Código</option>
        </select>
      </div>
      {typeResponse == '0' ? (
        <div className="flex flex-col">
          <input
            className="text-black"
            type="text"
            name="text"
            id="text"
            placeholder={'Ingresa tu respuesta'}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
      ) : typeResponse == '1' ? (
        <input
          className="text-white"
          type="file"
          accept="image/*"
          required
          onChange={(e) => setImage(e)}
        />
      ) : typeResponse == '2' ? (
        <input
          className="text-white"
          type="file"
          accept="application/pdf"
          required
          onChange={(e) => setPDF(e)}
        />
      ) : typeResponse == '3' ? (
        <div className="flex flex-col text-[--black]">
          <textarea
            name="code"
            id="code"
            rows={10}
            cols={50}
            placeholder="Pega tu código aquí..."
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
        </div>
      ) : null}
    </>
  );
};
