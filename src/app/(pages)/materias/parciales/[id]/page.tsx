import { MainModule } from '../../../../components/feature/materias/mainModule'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { midtermUseCases } from '@/app/lib/server/usecases/midterm.usecases'

interface Params {
  params: Promise<{ id: string }>
  searchParams: Promise<{ idModule: string | undefined }>
}

export default async function Practica({ params, searchParams }: Params) {
  const { id } = await params
  const { idModule } = await searchParams
  const [course, modules] = await Promise.all([
    courseUseCases.getById(id),
    midtermUseCases.findByCourseIdWithAllData(id)
  ])

  return <MainModule modules={modules} course={course} idModule={idModule} typeModule="Practica" />
}
