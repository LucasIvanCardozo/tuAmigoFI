import { fetchProblems } from '@/app/lib/data';
import Image from 'next/image';

export default async function ProblemsTable({
  query,
}: {
  query: { text?: string; tps?: string; id_materias: string };
}) {
  const problems = await fetchProblems(query);
  return (
    <ul className="flex flex-col gap-4 grow relative overflow-y-auto">
      {problems.map(
        ({ id_problemas, text, response, type, response_plus, type_plus }) => (
          <li
            key={id_problemas}
            className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1"
          >
            {response_plus ? (
              <div className="relative grid grid-cols-[4fr_3fr] grid-rows-[minmax(10rem,1fr)] bg-[#C8E0E4] p-1 rounded-md">
                <p className="whitespace-pre-wrap">{text}</p>
                <div className="relative h-full">
                  <Image
                    className="object-contain"
                    src={`${response_plus}.${type_plus}`}
                    fill={true}
                    alt="Imagen"
                  />
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap bg-[#C8E0E4] p-1 rounded-md">
                {text}
              </p>
            )}
            <div className="relative w-full aspect-video">
              <Image
                className="object-contain"
                src={`${response}.${type}`}
                fill={true}
                alt="Imagen"
              />
            </div>
          </li>
        )
      )}
    </ul>
  );
}
