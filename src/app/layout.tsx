import type { Metadata } from 'next'
import './globals.css'
import { cabin } from './assets/fonts'
import Nav from './components/layout/nav'
import Providers from './components/layout/providers'
import Footer from './components/layout/footer'
import { Loader } from './components/layout/loader'
import { IconBackground } from './components/layout/IconBackground'
import { getSession } from './lib/server/actions/users/get.server.user'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tu amigo FI',
  description: 'Creada para ayudar a ingresantes y avanzados alumnos, en la Facultad de Ingenieria de Mar del Plata, con su desafiante carrera.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const callbackSession = getSession()
  return (
    <html lang="es">
      <body id="root" className={cabin.className + ' flex flex-col h-dvh'}>
        <Providers>
          <Suspense>
            <Nav callbackSession={callbackSession} />
          </Suspense>
          <IconBackground />
          {children}
          <Footer />
          <Suspense>
            <Loader />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
