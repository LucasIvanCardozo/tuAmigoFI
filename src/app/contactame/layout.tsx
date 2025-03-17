import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contáctame - Tu amigo FI',
  description:
    'Encuentra aquí todos los enlaces y métodos para ponerte en contacto conmigo. ¡Estoy atento a tus sugerencias, dudas y colaboraciones!',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
