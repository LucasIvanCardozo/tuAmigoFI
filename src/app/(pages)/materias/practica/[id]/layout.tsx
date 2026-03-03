import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const course = await courseUseCases.getById(id)

  return {
    title: `${course.name} - Trabajos Prácticos`,
    description: `Espacio colaborativo donde los estudiantes de ${course.name} pueden subir trabajos prácticos, compartir respuestas y comentar en cada entrega para detectar y corregir errores.`,
  }
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
