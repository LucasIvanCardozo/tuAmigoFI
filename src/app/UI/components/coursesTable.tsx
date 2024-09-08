import { fetchCourses } from '@/app/lib/data';
import Course from './course';

export default async function CoursesTable({
  query,
}: {
  query: { search?: string; year?: number; degree?: number };
}) {
  const courses = await fetchCourses(query);

  return (
    <ul className="w-full flex flex-col gap-3 items-center my-5 text-[--black]">
      {courses?.map((course) => (
        <Course key={course.id} course={course} id_carrera={query.degree} />
      ))}
      <button>Click Me</button>
    </ul>
  );
}
