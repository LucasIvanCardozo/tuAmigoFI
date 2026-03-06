'use client'

import { Course } from '@/app/lib/server/db/prisma/prismaClient/client'
import { handleLoader } from '@/app/utils/handleLoader'
import { useEffect } from 'react'

interface Params {
  courses: Course[]
}
export const UpdateLoader = ({ courses }: Params) => {
  useEffect(() => {
    handleLoader(false)
  }, [courses])
  return <></>
}
