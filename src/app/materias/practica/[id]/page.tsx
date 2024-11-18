import { fetchCourse, fetchTps } from '@/app/lib/data';
import AsideProblemsTps from '@/app/UI/components/tps/asideProblemsTps';
import ProblemsTableTp from '@/app/UI/components/tps/problemsTableTp';

export default async function Practica({ params }: { params: { id: string } }) {
  const id_materia = Number(params.id);
  const course = await fetchCourse(id_materia);
  const tpList = await fetchTps({ id_materias: id_materia });

  return (
    <>
      <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
        <AsideProblemsTps tpList={tpList} idCourse={id_materia} />
        <section className="text-[--black] flex flex-col grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <b>{course.name}</b>
              </h1>
            </div>
          </div>
          <ProblemsTableTp tpList={tpList} />
        </section>
      </main>
    </>
  );
}
