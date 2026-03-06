import { MainModule } from '../../../../components/feature/materias/mainModule'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { midtermUseCases } from '@/app/lib/server/usecases/midterm.usecases'

interface Params {
  params: { id: string }
}

export default async function Practica({ params }: Params) {
  const idCourse = params.id
  const course = await courseUseCases.getById(idCourse)
  const modules = await midtermUseCases.findByCourseIdWithAllData(idCourse)

  return <MainModule modules={modules} course={course} typeModule="Practica" />
}
