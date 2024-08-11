import type { Metadata } from 'next';
import './globals.css';
import { cabin } from './UI/fonts';
import Nav from './UI/components/nav';

export const metadata: Metadata = {
  title: 'Tu amigo FI',
  description:
    'Creada para ayudar a ingresantes y avanzados alumnos, en la Facultad de Ingenieria de Mar del Plata, con su desafiante carrera.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cabin.className}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
