import { fetchCourse, fetchMidtermsWithAllData } from '@/app/lib/data';
import { MainModule } from '../../components/mainModule';
import { makeModules } from '../../utils/makeModules';

export default async function Practica({ params }: { params: { id: string } }) {
  const id_materia = Number(params.id);
  const course = await fetchCourse(id_materia);
  const moduleList = await fetchMidtermsWithAllData(id_materia);
  let modules = makeModules({ moduleList: moduleList, type: 'midterms' });

  return <MainModule modules={modules} course={course} typeModule="Practica" />;
}
