import { fetchCourses } from '@/app/lib/data';
import Course from './course';

export default async function CoursesTable({
  query,
}: {
  query: { name?: string; year?: string; degree?: string };
}) {
  const courses = await fetchCourses(query);
  return (
    <ul className="w-full flex flex-col gap-3 items-center my-5 text-[--black]">
      {courses?.map(({ id_materias, name, cg, hs, plan }) => (
        <Course
          key={id_materias}
          id_materias={id_materias}
          id_carreras={query.degree ?? ''}
          name={name}
          cg={cg}
          hs={hs}
          plan={plan}
        />
      ))}
    </ul>
  );
}
