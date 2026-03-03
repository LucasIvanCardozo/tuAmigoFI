import { degreeUseCases } from '@/app/lib/server/usecases/degree.usecases'

export default async function DegreeList({ idCourse }: { idCourse: string }) {
  const degrees = await degreeUseCases.findByCourseId(idCourse)

  return degrees.map(({ name }, index) => (
    <span key={index} className="whitespace-nowrap">
      {`${name}`}
      {index !== degrees.length - 1 && ' -'}
    </span>
  ))
}
