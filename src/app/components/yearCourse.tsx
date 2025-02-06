import { fetchYears } from '@/app/lib/data';
import { years } from '@prisma/client';
import YearStructures from './YearStructure';

export default async function YearCourse() {
  const years = await fetchYears();
  return <YearStructures years={years} />;
}
