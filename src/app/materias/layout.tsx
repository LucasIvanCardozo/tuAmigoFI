import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Materias - Tu amigo FI',
  description:
    'Descubre todas las materias de la Facultad de Ingeniería de Mar del Plata. Realiza búsquedas, consulta correlativas y explora enlaces útiles compartidos por estudiantes.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
