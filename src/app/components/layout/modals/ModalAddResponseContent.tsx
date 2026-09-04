'use client';
import type { Session } from 'next-auth';
import { useModal } from '@/app/contexts/ModalContext';
import { useReload } from '@/app/hooks/useReload';
import { createResponse } from '@/app/lib/server/actions/responses/create.action';
import type { Module, TypeValues } from '@/app/types';
import { Form } from '../form/form';
import { HandlerInputs } from '../form/inputs/handlerInputs';

export const ModalAddResponseContent = ({
  module,
  session,
}: {
  module: Module;
  session: Session | null;
}) => {
  const { closeModal } = useModal();
  const { startReload } = useReload();
  const isTp = 'number' in module;

  const submitAddResponse = async (values: TypeValues[]) => {
    const number = values.find((val) => val.id === 'number');
    const selectResponse = values.find((val) => val.id === 'selectResponse');
    if (!session) throw new Error('No hay sesion');
    if (!number || !selectResponse) throw new Error('Faltan datos');
    const typeResponse = selectResponse.inputType;
    const { error } = await createResponse({
      idUser: session.user.id,
      idTp: isTp ? module.id : null,
      idMidterm: !isTp ? module.id : null,
      number: Number(number.value),
      text:
        typeResponse === 'TEXT' || typeResponse === 'CODE'
          ? (selectResponse.value as string)
          : null,
      file:
        typeResponse === 'IMAGE' || typeResponse === 'PDF' ? (selectResponse.value as File) : null,
      type: typeResponse,
    });
    if (error) throw new Error(error);
    startReload();
  };

  return (
    <>
      <h2 className="text-lg">Añadir una respuesta</h2>
      <Form onSubmit={(e: TypeValues[]) => submitAddResponse(e)} onEnd={() => closeModal()}>
        <div className="flex flex-col">
          <label htmlFor="number">Número</label>
          <HandlerInputs
            type="number"
            id="number"
            name="number"
            min={0}
            max={100}
            placeholder="Número del problema"
            required={true}
          />
        </div>
        <HandlerInputs
          type="selectResponse"
          id="selectResponse"
          required={true}
          name="selectResponse"
        />
        <div>
          <p>Esta respuesta se añadirá al módulo &quot;{module.name}&quot;</p>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que las respuestas estén legibles y sean para este módulo. En
            caso de cualquier problema podes contactarme:{' '}
            <a
              className="underline"
              target="_blank"
              href="https://wa.me/+5492235319564"
              rel="noopener"
            >
              2235319564
            </a>
          </p>
        </div>
      </Form>
    </>
  );
};
