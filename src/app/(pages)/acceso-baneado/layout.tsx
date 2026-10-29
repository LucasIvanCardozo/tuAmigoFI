import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceso bloqueado - Tu amigo FI',
  description:
    'Tu usuario está baneado de Tu amigo FI. Si creés que es un error, contactame y lo revisamos.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
