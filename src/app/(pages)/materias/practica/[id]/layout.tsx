import type { Metadata } from 'next';
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = await courseUseCases.getById(id);

  return {
    title: `${course.name} - Trabajos Prácticos`,
    description: `Espacio colaborativo donde los estudiantes de ${course.name} pueden subir trabajos prácticos, compartir respuestas y comentar en cada entrega para detectar y corregir errores.`,
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
