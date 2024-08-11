import CoursesTable from '../UI/components/coursesTable';
import { Suspense } from 'react';
import SearchCourses from '../UI/components/searchCourses';
import { fetchYearsDegree } from '../lib/data';
import DegreeCourse from '../UI/components/degreeCourse';
import YearCourse from '../UI/components/yearCourse';

export default async function Materias({
  searchParams,
}: {
  searchParams?: {
    name?: string;
    year?: string;
    degree?: string;
  };
}) {
  const query = searchParams || {};
  const { years, degrees } = await fetchYearsDegree();

  return (
    <>
      <main className="w-full h-40"></main>
      <section className="flex flex-col max-w-screen-md w-11/12 m-auto items-center">
        <div className="flex flex-col w-full gap-1 text-[--black] sm:flex-row">
          <Suspense>
            <SearchCourses />
          </Suspense>
          <Suspense fallback={<h1>Cargando</h1>}>
            <YearCourse years={years} />
          </Suspense>
          <Suspense fallback={<h1>Cargando</h1>}>
            <DegreeCourse degrees={degrees} />
          </Suspense>
        </div>
        <Suspense fallback={<h1>Cargando</h1>}>
          <CoursesTable query={query} />
        </Suspense>
      </section>
    </>
  );
}
