import { fetchCourses } from '@/app/lib/data';
import Course from './course';
import { Suspense } from 'react';
import CourseSkeleton from './skeletons/courseSkeleton';
import IndexList from './indexList';

export default async function CoursesTable({
  query,
}: {
  query: { search?: string; year?: number; degree?: number; page?: number };
}) {
  const courses = await fetchCourses(query);

  return (
    <ul className="w-full flex flex-col gap-3 items-center my-5 text-[--black]">
      <Suspense>
        {courses?.map((course) => (
          <Suspense key={course.id} fallback={<CourseSkeleton />}>
            <Course course={course} id_carrera={query.degree} />
          </Suspense>
        ))}
      </Suspense>
      <IndexList query={query} />
    </ul>
  );
}
