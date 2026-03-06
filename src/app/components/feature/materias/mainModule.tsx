'use client'
import { ProblemsTable } from './problemsTable'
import { useMainContext } from '@/app/contexts'
import { useEffect } from 'react'
import { DataModule } from '@/app/types'
import { AsideModules } from './asideModules'
import { Course } from '@/app/lib/server/db/prisma/prismaClient/client'

interface Params {
  modules: DataModule[]
  course: Course
  typeModule: 'TP' | 'Practica'
}

export const MainModule = ({ modules, course, typeModule }: Params) => {
  const { setCourse, setTypeModule, setModules } = useMainContext()

  useEffect(() => {
    setCourse(course)
  }, [course])

  useEffect(() => {
    setModules(modules)
  }, modules)

  useEffect(() => {
    setTypeModule(typeModule)
  }, [typeModule])

  return (
    <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
      <AsideModules />
      <section className="text-[--black] flex flex-col grow relative h-full p-3 overflow-hidden sm:p-0 ">
        <div>
          <div className="flex justify-between items-end">
            <h1 className="text-2xl sm:text-3xl font-bold">
              <b>{course.name}</b>
            </h1>
          </div>
        </div>
        <ProblemsTable />
      </section>
    </main>
  )
}
