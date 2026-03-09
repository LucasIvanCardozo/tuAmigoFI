import { MainModule } from '../../../../components/feature/materias/mainModule'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { tpUseCases } from '@/app/lib/server/usecases/tp.usecases'

interface Props {
  params: { id: string }
  searchParams?: {
    idModule: string
  }
}

export default async function Practica({ params, searchParams }: Props) {
  const { id: idCourse } = params
  const { idModule } = { idModule: searchParams?.idModule }
  const course = await courseUseCases.getById(idCourse)
  const modules = await tpUseCases.findByCourseIdWithAllData(idCourse)

  return <MainModule modules={modules} course={course} typeModule="TP" idModule={idModule} />
}
