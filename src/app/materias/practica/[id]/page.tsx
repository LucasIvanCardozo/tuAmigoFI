import { fetchCourse, fetchTps } from '@/app/lib/data';
import ProblemsTable from '@/app/UI/components/problemsTable';
import AsideProblems from '@/app/UI/components/asideProblems';

export default async function Practica({ params }: { params: { id: string } }) {
  const id_materia = Number(params.id);
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
          </div>
          <ProblemsTable tpList={tpList} />
        </section>
      </main>
    </>
  );
}
