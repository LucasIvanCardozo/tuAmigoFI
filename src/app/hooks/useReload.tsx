import { useRouter } from 'next/navigation'
import { startTransition, useCallback } from 'react'

export const useReload = () => {
  const { refresh } = useRouter()

  const startReload = useCallback(() => {
    startTransition(refresh)
  }, [refresh])

  return { startReload }
}
