import { MainModule } from '../../components/mainModule'
import { makeModules } from '../../utils/makeModules'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { midtermUseCases } from '@/app/lib/server/usecases/midterm.usecases'

interface Params {
  params: { id: string }
}

// async function Content({ params }: Params) {
//   const id_materia = Number(params.id);
//   const course = await fetchCourse(id_materia);
//   const moduleList = await fetchMidtermsWithAllData(id_materia);
//   let modules = makeModules({ moduleList: moduleList, type: 'midterms' });
//   return <MainModule modules={modules} course={course} typeModule="Practica" />;
// }

export default async function Practica({ params }: Params) {
  const idCourse = params.id
  const course = await courseUseCases.getById(idCourse)
  const moduleList = await midtermUseCases.findByCourseIdWithAllData(idCourse)
  let modules = makeModules({ moduleList: moduleList, type: 'midterms' })
  return (
    <MainModule modules={modules} course={course} typeModule="Practica" />
    /*<Suspense fallback={<MainSkeleton />}>
      <Content params={params} />
    </Suspense>*/
  )
}
