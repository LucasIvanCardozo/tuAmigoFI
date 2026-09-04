'use client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sileo';
import { FormProvider } from '@/app/contexts';
import { ModalProvider } from '@/app/contexts/ModalContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FormProvider>
        <ModalProvider>
          <Toaster options={{ duration: 3000 }} theme="dark" position="top-center">
            {children}
          </Toaster>
        </ModalProvider>
      </FormProvider>
    </SessionProvider>
  );
}
