import { fetchDegreesWithCourse } from '@/app/lib/data';
import DegreesListStructure from './degreesListStructure';

export default async function DegreesList({ idCourse }: { idCourse: number }) {
  const degrees = await fetchDegreesWithCourse({ id_course: idCourse });

  return <DegreesListStructure degrees={degrees} />;
}
