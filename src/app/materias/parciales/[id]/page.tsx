import { fetchCourse, fetchMidtermsWithAllData } from '@/app/lib/data';
import { MainModule } from '../../components/mainModule';
import { makeModules } from '../../utils/makeModules';
import { Suspense } from 'react';

interface Params {
  params: { id: string };
}

async function Content({ params }: Params) {
  const id_materia = Number(params.id);
  const course = await fetchCourse(id_materia);
  const moduleList = await fetchMidtermsWithAllData(id_materia);
  let modules = makeModules({ moduleList: moduleList, type: 'midterms' });
  return <MainModule modules={modules} course={course} typeModule="Practica" />;
}

export default async function Practica({ params }: Params) {
  return (
    <Suspense fallback={<div>Cargando</div>}>
      <Content params={params} />
    </Suspense>
  );
}
