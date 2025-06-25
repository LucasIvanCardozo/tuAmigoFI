import { capitalize } from '@/app/utils/capitalize';
import z from 'zod';

export default function createAction<T extends z.Schema, K>(
  schema: T | null,
  callback: (data: z.infer<T>) => Promise<K>
): Response<z.infer<T>, K> {
  return async (values) => {
    try {
      const data = await callback(schema?.parse(values) ?? values);

      return {
        success: true,
        data,
        error: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError)
        return {
          success: false,
          data: null,
          error: error.errors.map(({ message }) => ' 🡆 ' + message).join('\n'),
        };

      return {
        success: false,
        data: null,
        error: capitalize((error as Error).message),
      };
    }
  };
}

type Response<TValue, TData> = (
  values?: TValue | Record<string, unknown>
) => Promise<
  | {
      success: true;
      data: TData;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: string;
    }
>;
