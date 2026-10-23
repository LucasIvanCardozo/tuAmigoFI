'use server';
import { cuid, object } from 'zod';
import { userUseCases } from '../../usecases/user.usecases';
import createAction from '../createActions';

const schema = object({
  idUser: cuid(),
});

export const getUserContributions = createAction(schema, async ({ idUser }) => {
  const contributions = await userUseCases.findContributions(idUser);
  if (!contributions) throw new Error('No se encontro al usuario');
  return contributions;
});
