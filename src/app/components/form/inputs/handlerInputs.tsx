import { useFormContext } from '@/app/lib/contexts';
import { TypeInput, TypeResponse, TypeValues } from '@/app/assets/types';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  InputText,
  InputNumber,
  InputFile,
  InputSelect,
  InputTextarea,
  InputCheckbox,
  InputSelectResponse,
  InputDate,
} from './index';

export const HandlerInputs = (input: TypeInput) => {
  const inputType = input.type;
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
        if (file.size > 3145728) {
          e.target.value = '';
          setError('El archivo pesa más de 3 MB');
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
        if (file.size > 5242880) {
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
      const validate = values.find((val) => val.id == input.id);
      if (!validate) {
        const thisvalidate: TypeValues = {
          id: input.id,
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
          validate: !input.required,
        };
        return [...validates, thisvalidate];
      } else return validates;
    });
  }, []);

  useEffect(() => {
    if (input.required) {
      const validate = values.find((val) => val.id == input.id);
      if (validate) {
        if (value || file || checkbox || date) {
          setValues(
            values.map((val) =>
              val.id == input.id
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
              val.id == input.id
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
        <InputText input={input} onChange={setValue} />
      ) : inputType == 'number' ? (
        <InputNumber input={input} onChange={setValue} />
      ) : inputType == 'file' ? (
        <InputFile input={input} onChange={handlePDF} />
      ) : inputType == 'select' ? (
        <InputSelect input={input} onChange={setValue} />
      ) : inputType == 'textarea' ? (
        <InputTextarea input={input} onChange={setValue} />
      ) : inputType == 'checkbox' ? (
        <InputCheckbox input={input} onChange={setCheckbox} />
      ) : inputType == 'selectResponse' ? (
        <InputSelectResponse
          input={input}
          typeResponse={typeResponse}
          onChange={handleSelectResponse}
          setImage={handleImage}
          setPDF={handlePDF}
          setValue={setValue}
        />
      ) : inputType == 'date' ? (
        <InputDate input={input} onChange={setDate} />
      ) : null}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};
