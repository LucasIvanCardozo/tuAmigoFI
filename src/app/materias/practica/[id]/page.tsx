import { fetchCourse, fetchTps } from '@/app/lib/data';
import ProblemsTable from '@/app/UI/components/problemsTable';
import SearchProblems from '@/app/UI/components/searchProblems';
import AsideProblems from '@/app/UI/components/asideProblems';
import { Suspense } from 'react';
import TpsSkeleton from '@/app/UI/components/skeletons/tpsSkeleton';

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
  const course = await fetchCourse(id_materia);
  const tpList = await fetchTps({ id_materias: id_materia });
  const tps = await fetchTps({
    id_tps: query.id_tps,
    id_materias: query.id_materias,
  });

  return (
    <>
      <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
        <AsideProblems tpList={tpList} />
        <section className="text-[--black] flex flex-col grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <b>{course.name}</b>
              </h1>
            </div>
            <SearchProblems />
          </div>
          <ProblemsTable text={query.text} tps={tps} />
        </section>
      </main>
    </>
  );
}
