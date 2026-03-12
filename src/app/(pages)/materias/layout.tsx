import { Loading } from '@/app/components/layout/loading'
import { MainProvider } from '@/app/contexts'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Materias - Tu amigo FI',
  description:
    'Descubre todas las materias de la Facultad de Ingeniería de Mar del Plata. Realiza búsquedas, consulta correlativas y explora enlaces útiles compartidos por estudiantes.',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense
      fallback={
        <div className="h-dvh w-dvw flex items-center justify-center">
          <Loading mode="black" size={6} />
        </div>
      }
    >
      <MainProvider>{children}</MainProvider>
    </Suspense>
  )
}
