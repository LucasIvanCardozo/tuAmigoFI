import { ProblemsTable } from './problemsTable'
import { DataModule } from '@/app/types'
import { AsideModules } from './asideModules'
import { Course } from '@/app/lib/server/db/prisma/prismaClient/client'

interface Props {
  modules: DataModule[]
  course: Course
  typeModule: 'TP' | 'Practica'
  idModule?: string
}

export const MainModule = async ({ modules, course, typeModule, idModule }: Props) => {
  return (
    <main className="h-screen w-full pt-8 flex gap-2 max-w-(--breakpoint-lg) m-auto sm:pb-3 sm:px-2 sm:pt-16">
      <AsideModules modules={modules} course={course} typeModule={typeModule} idModule={idModule} />
      <section className="text-(--black) flex flex-col grow relative h-full p-3 overflow-hidden sm:p-0 ">
        <div>
          <div className="flex justify-between items-end">
            <h1 className="text-2xl sm:text-3xl font-bold">
              <b>{course.name}</b>
            </h1>
          </div>
        </div>
        <ProblemsTable idModule={idModule} modules={modules} typeModule={typeModule} />
      </section>
    </main>
  )
}
