'use client'
import { DataModule } from '@/app/types'
import { createContext, useContext, useState } from 'react'
import { Course } from '../lib/server/db/prisma/prismaClient/client'

interface TypeMainContext {
  course: Course
  setCourse: (course: Course) => void
  typeModule: 'TP' | 'Practica'
  setTypeModule: (typeModule: 'TP' | 'Practica') => void
  viewModule: string | null
  setViewModule: (number: string | null) => void
  modules: DataModule[]
  setModules: (dataModules: DataModule[]) => void
}

export const MainContext = createContext<TypeMainContext | null>(null)

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [modules, setModules] = useState<DataModule[]>([])
  const [viewModule, setViewModule] = useState<string | null>(null)
  const [course, setCourse] = useState<Course>({} as Course)
  const [typeModule, setTypeModule] = useState<'TP' | 'Practica'>('TP')

  return (
    <MainContext.Provider
      value={{
        viewModule,
        setViewModule,
        modules,
        setModules,
        course,
        setCourse,
        typeModule,
        setTypeModule,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export const useMainContext = () => {
  const context = useContext(MainContext)
  if (!context) throw new Error('useMainContext must be used within a MainProvider')
  return context
}
