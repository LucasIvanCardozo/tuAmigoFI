import { fetchDegrees } from '@/app/lib/data';
import DegreeStructure from './degreeStructure';

export default async function DegreeCourse() {
  const degrees = await fetchDegrees();
  return <DegreeStructure degrees={degrees} />;
}
