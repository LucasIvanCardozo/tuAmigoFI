import { fetchDegreesWithCourse } from '@/app/lib/data';
import { degrees } from '@prisma/client';

export default async function DegreesListStructure({
  degrees,
}: {
  degrees: degrees[];
}) {
  return degrees.map(({ name }, index) => (
    <span key={index} className="whitespace-nowrap">
      {`${name}`}
      {index !== degrees.length - 1 && ' -'}
    </span>
  ));
}
