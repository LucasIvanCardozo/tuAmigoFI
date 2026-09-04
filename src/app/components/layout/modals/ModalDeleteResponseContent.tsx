'use client';
import { useSession } from 'next-auth/react';
import { useModal } from '@/app/contexts/ModalContext';
import { useReload } from '@/app/hooks/useReload';
import { deleteResponse } from '@/app/lib/server/actions/responses/delete.action';
import type { Response, User } from '@/app/lib/server/db/prisma/prismaClient/client';
import type { TypeValues } from '@/app/types';
import { Form } from '../form/form';
import { HandlerInputs } from '../form/inputs/handlerInputs';

export const ModalDeleteResponseContent = ({
  response,
  user,
}: {
  response: Response;
  user: User;
}) => {
  const { id, idUser } = response;
  const { closeModal } = useModal();
  const { startReload } = useReload();
  const { data: session } = useSession();

  const submitDeleteResponse = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id === 'check');
    if (!check) throw new Error('Debes estar de acuerdo con la eliminacion de la respuesta');
    if (!session) throw new Error('No hay sesion');
    if (session.user.tier !== 2 && session.user.id !== user.id)
      throw new Error('Debes ser administrador o el creador para eliminar una respuesta');

    const { error } = await deleteResponse({ id, idUser });
    if (error) throw new Error(`Error: ${error}`);
    startReload();
  };

  return (
    <>
      <h2 className="text-lg">Eliminar respuesta</h2>
      <Form onSubmit={(e: TypeValues[]) => submitDeleteResponse(e)} onEnd={() => closeModal()}>
        <div>
          <div className="flex flex-col *:flex *:gap-1">
            <p>
              <b>Numero del problema:</b>
              {response.number}
            </p>
            <p>
              <b>Subida por:</b>
              {user.name}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que la respuesta sea la que quieres eliminar. Se borrara esta
            misma con todas sus reacciones. En caso de cualquier problema podés contactarme:{' '}
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
        <HandlerInputs
          type="checkbox"
          id="check"
          name="check"
          placeholder="Confirmo la eliminación."
          required={true}
        />
      </Form>
    </>
  );
};
