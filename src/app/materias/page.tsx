import CoursesTable from '../UI/components/coursesTable';
import { Suspense } from 'react';
import SearchCourses from '../UI/components/searchCourses';
import { fetchDegree, fetchYears } from '../lib/data';
import DegreeCourse from '../UI/components/degreeCourse';
import YearCourse from '../UI/components/yearCourse';
import Image from 'next/image';

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
      <main className="relative flex justify-center pb-4 w-10/12 max-w-screen-sm mt-12 m-auto gap-2 h-auto text-[--black] sm:mt-16">
        <div>
          <Image
            className="object-contain h-full"
            src="/FI.png"
            width={200}
            height={200}
            alt=""
          />
        </div>
        <h1 className="font-bold text-4xl text-balance max-w-72">
          Buscá tu materia!
          <p className="text-lg font-normal hidden sm:block">
            Aquí encontrarás todo lo necesario para mejorar tus prácticas c:
          </p>
        </h1>
      </main>
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
