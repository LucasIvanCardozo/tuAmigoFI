import { MainModule } from '../../components/mainModule'
import { makeModules } from '../../utils/makeModules'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { tpUseCases } from '@/app/lib/server/usecases/tp.usecases'

interface Props {
  params: { id: string }
}

export default async function Practica({ params }: Props) {
  const { id: idCourse } = params
  const course = await courseUseCases.getById(idCourse)
  const moduleList = await tpUseCases.findByCourseIdWithAllData(idCourse)

  let modules = makeModules({ moduleList: moduleList, type: 'tps' })

  return <MainModule modules={modules} course={course} typeModule="TP" />
}
