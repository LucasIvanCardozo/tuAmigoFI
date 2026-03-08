'use client'
import { TypeValues } from '@/app/types'
import { createContext, useContext, useState } from 'react'

interface FromContextType {
  values: TypeValues[]
  setValues: React.Dispatch<React.SetStateAction<TypeValues[]>>
}

export const FormContext = createContext<FromContextType | null>(null)

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [values, setValues] = useState<TypeValues[]>([])

  return <FormContext.Provider value={{ values, setValues }}>{children}</FormContext.Provider>
}

export const useForm = () => {
  const context = useContext(FormContext)
  if (!context) throw new Error('useFormContext must be used within a FormProvider')
  return context
}
