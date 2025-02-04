import { useFormContext } from '@/app/lib/context';
import { TypeInput, TypeResponse, TypeValues } from '@/app/types';
import { ChangeEvent, useEffect, useState } from 'react';

export const InputCustom = (params: TypeInput) => {
  const inputType = params.type;
  const { values, setValues } = useFormContext();
  const [typeResponse, setTypeResponse] = useState<TypeResponse>('');
  const [value, setValue] = useState('');
  const [file, setFile] = useState<File>();
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [error, setError] = useState('');

  const handlePDF = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type == 'application/pdf') {
        if (file.size > 5242880) {
          e.target.value = '';
          setError('El archivo pesa más de 5 MB');
        } else {
          setFile(file);
          setError('');
        }
      } else {
        setError('Por favor selecciona un archivo .pdf');
        setFile(undefined);
        e.target.value = '';
      }
    } else {
      setFile(undefined);
    }
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.split('/')[0] == 'image') {
        if (file.size > 1048576) {
          e.target.value = '';
          setError('El archivo pesa más de 1 MB');
        } else {
          setFile(file);
          setError('');
        }
      } else {
        setError('Por favor selecciona una imagen');
        setFile(undefined);
        e.target.value = '';
      }
    } else {
      setFile(undefined);
    }
  };

  const handleSelectResponse = (value: TypeResponse) => {
    setTypeResponse(value);
    setValue('');
    setFile(undefined);
    setError('');
  };

  useEffect(() => {
    setValues((validates: TypeValues[]) => {
      const validate = values.find((val) => val.id == params.id);
      if (!validate) {
        const thisvalidate: TypeValues = {
          id: params.id,
          value:
            inputType == 'text' ||
            inputType == 'number' ||
            inputType == 'textarea' ||
            inputType == 'select' ||
            inputType == 'selectResponse'
              ? ''
              : inputType == 'file' || inputType == 'date'
              ? undefined
              : false,
          inputType: typeResponse,
          validate: !params.required,
        };
        return [...validates, thisvalidate];
      } else return validates;
    });
  }, []);

  useEffect(() => {
    if (params.required) {
      const validate = values.find((val) => val.id == params.id);
      if (validate) {
        if (value || file || checkbox || date) {
          setValues(
            values.map((val) =>
              val.id == params.id
                ? {
                    ...val,
                    value:
                      inputType == 'text' ||
                      inputType == 'number' ||
                      inputType == 'textarea' ||
                      inputType == 'select' ||
                      typeResponse == '0' ||
                      typeResponse == '3'
                        ? value
                        : inputType == 'file' ||
                          typeResponse == '1' ||
                          typeResponse == '2'
                        ? file
                        : inputType == 'date'
                        ? date
                        : checkbox,
                    inputType: typeResponse,
                    validate: true,
                  }
                : val
            )
          );
          setError('');
        } else {
          setValues(
            values.map((val) =>
              val.id == params.id
                ? {
                    ...val,
                    validate: false,
                  }
                : val
            )
          );
          setError(
            inputType == 'text' || inputType == 'textarea'
              ? 'debe colocar texto aquí'
              : inputType == 'number'
              ? 'debe colocar un número aquí.'
              : inputType == 'file'
              ? 'debe colocar un archivo aquí.'
              : inputType == 'select'
              ? 'debe seleccionar una opción.'
              : inputType == 'checkbox'
              ? 'debe hacer check aquí.'
              : inputType == 'selectResponse'
              ? 'debes subir tu respuesta'
              : inputType == 'date'
              ? 'debes seleccionar una fecha'
              : 'error.'
          );
        }
      }
    }
  }, [value, file, checkbox, date]);

  return (
    <div className="relative flex flex-col text-black">
      {inputType == 'text' ? (
        <input
          id={params.id}
          name={params.name}
          type={params.type}
          placeholder={params.placeholder}
          required={params.required}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : inputType == 'number' ? (
        <input
          id={params.id}
          name={params.name}
          type={params.type}
          min={params.min}
          max={params.max}
          placeholder={params.placeholder}
          required={params.required}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : inputType == 'file' ? (
        <input
          className="text-white"
          type="file"
          accept={params.accept}
          required={params.required}
          onChange={(e) => handlePDF(e)}
        />
      ) : inputType == 'select' ? (
        <select
          name={params.name}
          id={params.id}
          required={params.required}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">{params.placeholder}</option>
          {params.children}
        </select>
      ) : inputType == 'textarea' ? (
        <textarea
          id={params.id}
          name={params.name}
          rows={params.rows}
          cols={params.cols}
          placeholder={params.placeholder}
          required={params.required}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : inputType == 'checkbox' ? (
        <div className="flex gap-2 items-center text-white">
          <input
            type="checkbox"
            name={params.name}
            id={params.id}
            onChange={(e) => setCheckbox(e.target.checked)}
            required={params.required}
          />
          {params.placeholder && (
            <label htmlFor={params.name}>{params.placeholder}</label>
          )}
        </div>
      ) : inputType == 'selectResponse' ? (
        <>
          <div className="flex flex-col">
            <label className="text-white" htmlFor="type">
              Tipo de respuesta
            </label>
            <select
              className="text-black mb-2"
              name="type"
              id="type"
              onChange={(e) =>
                handleSelectResponse(e.target.value as TypeResponse)
              }
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
              onChange={(e) => handleImage(e)}
            />
          ) : typeResponse == '2' ? (
            <input
              className="text-white"
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => handlePDF(e)}
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
      ) : (
        <input
          type="date"
          id={params.id}
          name={params.name}
          required={params.required}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};
