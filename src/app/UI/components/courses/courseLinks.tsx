import { fetchLinks } from '@/app/lib/data';
import CourseLinksStructure from './courseLinksStructure';

export default async function CourseLinks({ id }: { id: number }) {
  const officialLinks = await fetchLinks({ official: true, id_materia: id });
  const unofficialLinks = await fetchLinks({ official: false, id_materia: id });

  return (
    <CourseLinksStructure
      linksOfficial={officialLinks}
      linksUnofficial={unofficialLinks}
    />
  );
}
