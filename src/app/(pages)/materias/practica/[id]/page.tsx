import { MainModule } from '../../../../components/feature/materias/mainModule'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { tpUseCases } from '@/app/lib/server/usecases/tp.usecases'

interface Props {
  params: { id: string }
}

export default async function Practica({ params }: Props) {
  const { id: idCourse } = params
  const course = await courseUseCases.getById(idCourse)
  const modules = await tpUseCases.findByCourseIdWithAllData(idCourse)

  return <MainModule modules={modules} course={course} typeModule="TP" />
}
