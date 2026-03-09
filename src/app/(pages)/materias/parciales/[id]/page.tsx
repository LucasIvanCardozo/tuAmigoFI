import { MainModule } from '../../../../components/feature/materias/mainModule'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { midtermUseCases } from '@/app/lib/server/usecases/midterm.usecases'

interface Params {
  params: { id: string }
  searchParams?: {
    idModule: string
  }
}

export default async function Practica({ params, searchParams }: Params) {
  const idCourse = params.id
  const { idModule } = { idModule: searchParams?.idModule }
  const course = await courseUseCases.getById(idCourse)
  const modules = await midtermUseCases.findByCourseIdWithAllData(idCourse)

  return <MainModule modules={modules} course={course} idModule={idModule} typeModule="Practica" />
}
