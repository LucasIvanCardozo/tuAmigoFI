import { fetchCourse } from '@/app/lib/data';
import { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const course = await fetchCourse(Number(id));

  return {
    title: `${course.name} - Parciales y Exámenes`,
    description: `Plataforma interactiva donde los estudiantes de ${course.name} pueden subir, consultar y comentar parciales y exámenes para mejorar su preparación en la Facultad de Ingeniería de Mar del Plata.`,
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
