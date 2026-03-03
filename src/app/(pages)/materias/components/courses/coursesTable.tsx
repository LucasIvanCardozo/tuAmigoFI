import Course from './course'
import IndexList from './indexList'
import { UpdateLoader } from './updateLoader'
import { CourseSearchParams } from '../../page'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'

export default async function CoursesTable({ query }: { query: CourseSearchParams }) {
  const courses = await courseUseCases.findByPage(query)
  const callbackAmount = courseUseCases.getAmountPages(query)

  return (
    <>
      <UpdateLoader courses={courses} />
      <ul className="w-full flex flex-col gap-3 items-center mt-5 mb-2 text-[--black]">
        {courses.map((course) => (
          <Course key={course.id} course={course} idDegree={query.idDegree} />
        ))}
      </ul>
      <IndexList query={query} callback={callbackAmount} />
    </>
  )
}
