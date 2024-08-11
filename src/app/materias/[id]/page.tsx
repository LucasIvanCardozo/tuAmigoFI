import { fetchCourses, fetchTpsFromCourse } from '@/app/lib/data';
import ProblemsTable from '@/app/UI/components/problemsTable';
import SearchProblems from '@/app/UI/components/searchProblems';
import AsideProblems from '@/app/UI/components/asideProblems';
import { Suspense } from 'react';

export default async function Practica({
  searchParams,
  params,
}: {
  searchParams: { text?: string; tps?: string };
  params: { id: string };
}) {
  const { id } = params;
  const query: { tps?: string; text?: string; id_materias: string } = {
    ...searchParams,
    id_materias: id,
  };
  const course = await fetchCourses({ id_materias: id });
  const tpList = await fetchTpsFromCourse(id);

  return (
    <>
      <main className="h-screen w-full pt-9 flex gap-3 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
        <Suspense>
          <AsideProblems tpList={tpList} />
        </Suspense>
        <section className="text-[--black] flex flex-col gap-2 grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl">
                <b>{course[0].name}</b>
              </h1>
              <span className="text-lg">{`Plan ${course[0].plan}`}</span>
            </div>
            <Suspense>
              <SearchProblems />
            </Suspense>
          </div>
          <Suspense>
            <ProblemsTable query={query} />
          </Suspense>
        </section>
      </main>
      <footer className="w-full h-20 bg-black"></footer>
    </>
  );
}
