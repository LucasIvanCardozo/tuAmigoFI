'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { use, useState } from 'react'
import { DegreesWithPlansType } from '../lib/server/db/repository/degree.repository'

export default function DegreeCourse({ callback }: { callback: Promise<DegreesWithPlansType[]> }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [degree, setDegree] = useState<string>(searchParams.get('idDegree')?.toString() ?? '')

  const degrees = use(callback)

  const handleDegree = (degree: string) => {
    const params = new URLSearchParams(searchParams)
    if (degree && degree != '0') {
      params.set('idDegree', degree)
    } else {
      params.delete('idDegree')
    }
    setDegree(degree)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      name="carreras"
      id="carreras"
      className="w-full sm:w-40"
      value={degree}
      aria-label="Elegir carrera de la materia"
      onChange={(e) => handleDegree(e.target.value)}
    >
      <option hidden>Carrera</option>
      <option value="0">Todas</option>

      {degrees?.map((degree) => (
        <option key={degree.id} value={degree.id}>
          {degree.name}
        </option>
      ))}
    </select>
  )
}
