import { fetchCourses } from '@/app/lib/data';
import Course from './course';
import IndexList from './indexList';

export default async function CoursesTable({
  query,
}: {
  query: { search?: string; year?: number; degree?: number; page?: number };
}) {
  const courses = await fetchCourses(query);

  return (
    <>
      <ul className="w-full flex flex-col gap-3 items-center mt-5 mb-2 text-[--black]">
        {courses.map((course) => (
          <Course key={course.id} course={course} id_carrera={query.degree} />
        ))}
      </ul>
      <IndexList query={query} />
    </>
  );
}
