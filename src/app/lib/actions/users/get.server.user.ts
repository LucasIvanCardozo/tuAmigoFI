import { getServerSession } from 'next-auth';
import { authOptions } from '../../authOptions';

export const getServerUser = async () => {
  const session = await getServerSession(authOptions);
  return { user: session?.user ?? null };
};
