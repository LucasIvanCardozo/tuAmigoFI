import { fetchCourse, fetchMidterms, fetchTps } from '@/app/lib/data';
import SearchProblems from '@/app/UI/components/searchProblems';
import AsideProblemsMidterms from '@/app/UI/components/asideProblemsMidterms';
import ProblemsTableMidterms from '@/app/UI/components/problemsTableMidterms';

export default async function Practica({
  searchParams,
  params,
}: {
  searchParams?: { text?: string; midterm?: string };
  params: { id: string };
}) {
  const id_materia = Number(params.id);
  const query: { id_midterm?: number; text?: string; id_materias: number } = {
    id_midterm: searchParams?.midterm
      ? Number(searchParams?.midterm)
      : undefined,
    text: searchParams?.text,
    id_materias: id_materia,
  };
  const course = await fetchCourse(id_materia);
  const midtermsList = await fetchMidterms({ id_materias: id_materia });

  let midterms = await fetchMidterms({
    id_midterm: query.id_midterm,
    id_materias: query.id_materias,
  });
  return (
    <>
      <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
        <AsideProblemsMidterms midtermsList={midtermsList} />
        <section className="text-[--black] flex flex-col grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <b>{course.name}</b>
              </h1>
              <span className="text-lg">{`Plan ${course.plan}`}</span>
            </div>
            <SearchProblems />
          </div>
          <ProblemsTableMidterms text={query.text} midterms={midterms} />
        </section>
      </main>
      <footer className="w-full h-20 bg-black"></footer>
    </>
  );
}
