'use client'
import { ProblemsTable } from './problemsTable'
import { MainContext } from '@/app/contexts'
import { useState } from 'react'
import { DataForm, DataModule } from '@/app/types'
import { AsideModules } from './aside/asideModules'
import { Course } from '@/app/lib/server/db/prisma/prismaClient/client'

interface Params {
  modules: DataModule[]
  course: Course
  typeModule: 'TP' | 'Practica'
}

export const MainModule = ({ modules, course, typeModule }: Params) => {
  const [modulesAux, setModulesAux] = useState(modules)
  const [viewModule, setViewModule] = useState<string | null>(null)
  const [dataForm, setDataForm] = useState<DataForm>({
    children: <></>,
    onSubmit: async () => {},
  })

  return (
    <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
      <MainContext.Provider
        value={{
          stateViewModule: {
            viewModule,
            setViewModule,
          },
          stateModules: {
            modules: modulesAux,
            setModules: setModulesAux,
          },
          stateForm: {
            dataForm,
            setDataForm,
          },
          course,
          typeModule,
        }}
      >
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
      </MainContext.Provider>
    </main>
  )
}
