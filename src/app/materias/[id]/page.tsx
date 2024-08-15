import { fetchCourse, fetchTps } from '@/app/lib/data';
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
  const course = await fetchCourse(id_materia);
  const tpList = await fetchTps({ id_materias: id_materia });
  let tps = await fetchTps({
    text: query.text,
    id_tps: query.id_tps,
    id_materias: query.id_materias,
    withProblems: true,
  });
  if (query.text) {
    const text: string = query.text;
    tps = tps.map((tp) => ({
      ...tp,
      tps_problems: tp.tps_problems.filter((mp) =>
        mp.problems.text_normalized.includes(text)
      ),
    }));
  }
  return (
    <>
      <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
        <Suspense>
          <AsideProblems tpList={tpList} />
        </Suspense>
        <section className="text-[--black] flex flex-col grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <b>{course.name}</b>
              </h1>
              <span className="text-lg">{`Plan ${course.plan}`}</span>
            </div>
            <Suspense>
              <SearchProblems />
            </Suspense>
          </div>
          <Suspense>
            <ProblemsTable tps={tps} />
          </Suspense>
        </section>
      </main>
      <footer className="w-full h-20 bg-black"></footer>
    </>
  );
}
