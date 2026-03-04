import { ReactNode } from 'react'
import { TypeResponse } from '../lib/server/db/prisma/prismaClient/enums'

export interface TypeValues {
  id: string
  value: string | boolean | File | undefined | TypeResponse | Date
  inputType: TypeResponse
  validate: boolean
}

export interface DataForm {
  children: ReactNode // Todos los inputs + submits que estarán dentro del formulario
  onSubmit: (values: TypeValues[]) => Promise<void> // Se ejecuta una vez se hace submit al formulario
  onEnd?: () => void //Se ejecuta una vez terminan todas las acciones del formulario
}
