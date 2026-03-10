import { z } from 'zod'
import { capitalize } from '@/app/utils/capitalize'

export default function createAction<T extends z.ZodTypeAny | null, K>(
  schema: T,
  callback: (data: T extends z.ZodTypeAny ? z.infer<T> : Record<string, unknown>) => Promise<K>
): Response<T extends z.ZodTypeAny ? z.infer<T> : Record<string, unknown>, K> {
  return async (values) => {
    try {
      const parsed = schema ? schema.parse(values) : (values ?? {})
      const data = await callback(parsed as any)

      return {
        success: true,
        data,
        error: null,
      }
    } catch (error) {
      if (error instanceof z.ZodError)
        return {
          success: false,
          data: null,
          error: error.issues.map(({ message }) => ' 🡆 ' + message).join('\n'),
        }

      return {
        success: false,
        data: null,
        error: capitalize((error as Error).message),
      }
    }
  }
}

type Response<TValue, TData> = (values?: TValue | Record<string, unknown>) => Promise<
  | {
      success: true
      data: TData
      error: null
    }
  | {
      success: false
      data: null
      error: string
    }
>
