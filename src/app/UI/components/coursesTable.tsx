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
      {courses?.map(({ id, name, cg, hs, optional }) => (
        <Course
          key={id}
          id_materia={id}
          id_carrera={query.degree}
          name={name}
          cg={cg}
          hs={hs}
          optional={optional}
        />
      ))}
      <button>Click Me</button>
    </ul>
  );
}
