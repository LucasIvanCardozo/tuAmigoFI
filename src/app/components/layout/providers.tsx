'use client'
import { FormProvider } from '@/app/contexts'
import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FormProvider>{children}</FormProvider>
    </SessionProvider>
  )
}
