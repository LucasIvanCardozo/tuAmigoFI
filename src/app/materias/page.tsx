import CoursesTable from '../UI/components/courses/coursesTable';
import SearchCourses from '../UI/components/courses/searchCourses';
import DegreeCourse from '../UI/components/degreeCourse';
import YearCourse from '../UI/components/yearCourse';
import Image from 'next/image';
import { Suspense } from 'react';
import CoursesSkeleton from '../UI/components/skeletons/coursesSkeleton';
import YearSkeleton from '../UI/components/skeletons/yearSkeleton';


export default async function Materias({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    year?: string;
    degree?: string;
    page?: string;
  };
}) {
  const query = {
    search: searchParams?.search,
    year: searchParams?.year ? Number(searchParams.year) : undefined,
    degree: searchParams?.degree ? Number(searchParams.degree) : undefined,
    page: searchParams?.page ? Number(searchParams.page) : undefined,
  };
  return (
    <>
      <main className="relative flex justify-center pb-4 w-10/12 max-w-screen-sm pt-12 m-auto gap-2 h-auto text-[--black] sm:pt-16">
        <div className="select-none">
          <Image
            className="object-contain h-full"
            src="/FI.svg"
            width={200}
            height={200}
            alt=""
          />
        </div>
        <h1 className="font-bold bg-[#F3F4F6] ml-1 p-1 rounded-2xl text-4xl text-balance h-fit max-w-72 rounded-es-none shadow-md sm:ml-6 sm:p-2">
          Buscá tu materia!
          <p className="text-lg font-normal hidden sm:block">
            Aquí encontrarás todo lo necesario para mejorar tus prácticas c:
          </p>
        </h1>
      </main>
      <section className="flex flex-col max-w-screen-md w-11/12 m-auto grow items-center">
        <div className="flex select-none flex-col w-full gap-1 text-[--black] sm:flex-row">
          <SearchCourses />
          <Suspense fallback={<YearSkeleton />}>
            <YearCourse />
          </Suspense>
          <Suspense fallback={<YearSkeleton />}>
            <DegreeCourse />
          </Suspense>
        </div>
        <Suspense fallback={<CoursesSkeleton />}>
          <CoursesTable query={query} />
        </Suspense>
      </section>
    </>
  );
}
