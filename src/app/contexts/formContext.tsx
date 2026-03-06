'use client'
import { TypeValues } from '@/app/types'
import { createContext, useContext, useEffect, useState } from 'react'

interface FromContextType {
  values: TypeValues[]
  setValues: React.Dispatch<React.SetStateAction<TypeValues[]>>
  error?: string
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const FormContext = createContext<FromContextType | null>(null)

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [values, setValues] = useState<TypeValues[]>([])
  const [error, setError] = useState<string>()

  return <FormContext.Provider value={{ values, setValues, error, setError }}>{children}</FormContext.Provider>
}

export const useForm = () => {
  const context = useContext(FormContext)
  if (!context) throw new Error('useFormContext must be used within a FormProvider')
  return context
}
