import { MainModule } from '../../../../components/feature/materias/mainModule'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { tpUseCases } from '@/app/lib/server/usecases/tp.usecases'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    idModule: string | undefined
  }>
}

export default async function Practica({ params, searchParams }: Props) {
  const { id } = await params
  const { idModule } = await searchParams
  const course = await courseUseCases.getById(id)
  const modules = await tpUseCases.findByCourseIdWithAllData(id)

  return <MainModule modules={modules} course={course} typeModule="TP" idModule={idModule} />
}
