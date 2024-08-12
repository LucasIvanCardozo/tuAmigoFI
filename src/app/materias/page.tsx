import CoursesTable from '../UI/components/coursesTable';
import { Suspense } from 'react';
import SearchCourses from '../UI/components/searchCourses';
import { fetchDegree, fetchYears } from '../lib/data';
import DegreeCourse from '../UI/components/degreeCourse';
import YearCourse from '../UI/components/yearCourse';

export default async function Materias({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    year?: string;
    degree?: string;
  };
}) {
  const query = {
    search: searchParams?.search,
    year: searchParams?.year ? Number(searchParams.year) : undefined,
    degree: searchParams?.degree ? Number(searchParams.degree) : undefined,
  };
  const degrees = await fetchDegree();
  const years = await fetchYears();

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
