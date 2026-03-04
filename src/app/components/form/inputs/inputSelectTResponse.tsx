import { TypeResponse } from '@/app/lib/server/db/prisma/prismaClient/enums'
import { inputSelectResponse } from '@/app/types'
import { ChangeEvent } from 'react'

interface Params {
  input: inputSelectResponse
  typeResponse?: TypeResponse
  onChange: (val: TypeResponse) => void
  setValue: (val: string) => void
  setImage: (val: ChangeEvent<HTMLInputElement>) => void
  setPDF: (val: ChangeEvent<HTMLInputElement>) => void
}
export const InputSelectResponse = ({ input, onChange, setValue, setImage, setPDF, typeResponse }: Params) => {
  return (
    <>
      <div className="flex flex-col">
        <label className="text-white" htmlFor={input.name}>
          Tipo de respuesta
        </label>
        <select className="text-black mb-2" name={input.name} id={input.id} onChange={(e) => onChange(e.target.value as TypeResponse)} required>
          <option value="" hidden>
            Selecciona el tipo respuesta
          </option>
          <option value="TEXT">Texto</option>
          <option value="IMAGE">Imagen</option>
          <option value="PDF">Pdf</option>
          <option value="CODE">Código</option>
        </select>
      </div>
      {typeResponse == 'TEXT' ? (
        <div className="flex flex-col text-[--black]">
          <textarea
            name="code"
            id="code"
            rows={3}
            cols={50}
            placeholder="Ingresa tu respuesta aquí..."
            required
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
        </div>
      ) : typeResponse == 'IMAGE' ? (
        <input className="text-white" type="file" accept="image/*" required onChange={(e) => setImage(e)} />
      ) : typeResponse == 'PDF' ? (
        <input className="text-white" type="file" accept="application/pdf" required onChange={(e) => setPDF(e)} />
      ) : typeResponse == 'CODE' ? (
        <div className="flex flex-col text-[--black]">
          <textarea
            name="code"
            id="code"
            rows={10}
            cols={50}
            required
            placeholder="Pega tu código aquí..."
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
        </div>
      ) : null}
    </>
  )
}
