import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política y Privacidad - Tu amigo FI',
  description:
    'Consulta nuestra política de privacidad para conocer cómo protegemos tus datos y garantizamos tu seguridad en Tu amigo FI.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
