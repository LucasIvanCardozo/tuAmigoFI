import { fetchCoursesWhitId, fetchTpsWhitCourse } from '@/app/lib/data';
import ProblemsTable from '@/app/UI/components/problemsTable';
import SearchProblems from '@/app/UI/components/searchProblems';
import AsideProblems from '@/app/UI/components/asideProblems';
import { Suspense } from 'react';

export default async function Practica({
  searchParams,
  params,
}: {
  searchParams?: { text?: string; tps?: string };
  params: { id: string };
}) {
  const id_materia = Number(params.id);
  const query: { id_tps?: number; text?: string; id_materias: number } = {
    id_tps: searchParams?.tps ? Number(searchParams?.tps) : undefined,
    text: searchParams?.text,
    id_materias: id_materia,
  };
  const course = await fetchCoursesWhitId(id_materia);
  const tpList = await fetchTpsWhitCourse(id_materia);

  return (
    <>
      <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
        <Suspense>
          <AsideProblems tpList={tpList} />
        </Suspense>
        <section className="text-[--black] flex flex-col grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl">
                <b>{course.name}</b>
              </h1>
              <span className="text-lg">{`Plan ${course.plan}`}</span>
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
