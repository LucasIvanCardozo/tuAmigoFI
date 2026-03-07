'use client'
import { FormProvider } from '@/app/contexts'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sileo'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FormProvider>
        <Toaster theme="dark" position="top-center">
          {children}
        </Toaster>
      </FormProvider>
    </SessionProvider>
  )
}
