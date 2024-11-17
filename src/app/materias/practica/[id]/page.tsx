import { fetchCourse, fetchTps } from '@/app/lib/data';
import ProblemsTable from '@/app/UI/components/problemsTable';
import SearchProblems from '@/app/UI/components/searchProblems';
import AsideProblems from '@/app/UI/components/asideProblems';

export default async function Practica({
  searchParams,
  params,
}: {
  searchParams?: { text?: string; tps?: string; modal?: string };
  params: { id: string };
}) {
  const id_materia = Number(params.id);
  const query: {
    id_tps?: number;
    text?: string;
    id_materias: number;
    modal?: number;
  } = {
    id_tps: searchParams?.tps ? Number(searchParams?.tps) : undefined,
    text: searchParams?.text,
    id_materias: id_materia,
    modal: searchParams?.modal ? Number(searchParams?.modal) : undefined,
  };
  const course = await fetchCourse(id_materia);
  const tpList = await fetchTps({ id_materias: id_materia });

  return (
    <>
      <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
        <AsideProblems tpList={tpList} idCourse={id_materia} />
        <section className="text-[--black] flex flex-col grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <b>{course.name}</b>
              </h1>
            </div>
            {/* <SearchProblems /> */}
          </div>
          <ProblemsTable text={query.text} tpList={tpList} />
        </section>
      </main>
    </>
  );
}
