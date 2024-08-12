import { fetchTpsWithProblemsIn } from '@/app/lib/data';
import Image from 'next/image';
import {
  TbSquareRoundedNumber0Filled,
  TbSquareRoundedNumber1Filled,
  TbSquareRoundedNumber2Filled,
  TbSquareRoundedNumber3Filled,
  TbSquareRoundedNumber4Filled,
  TbSquareRoundedNumber5Filled,
  TbSquareRoundedNumber6Filled,
  TbSquareRoundedNumber7Filled,
  TbSquareRoundedNumber8Filled,
  TbSquareRoundedNumber9Filled,
} from 'react-icons/tb';

export default async function ProblemsTable({
  query,
}: {
  query: { text?: string; id_tps?: number; id_materias: number };
}) {
  const numberIcons = [
    <TbSquareRoundedNumber0Filled />,
    <TbSquareRoundedNumber1Filled />,
    <TbSquareRoundedNumber2Filled />,
    <TbSquareRoundedNumber3Filled />,
    <TbSquareRoundedNumber4Filled />,
    <TbSquareRoundedNumber5Filled />,
    <TbSquareRoundedNumber6Filled />,
    <TbSquareRoundedNumber7Filled />,
    <TbSquareRoundedNumber8Filled />,
    <TbSquareRoundedNumber9Filled />,
  ];
  let tps = await fetchTpsWithProblemsIn(query);
  if (query.text) {
    const text: string = query.text;
    tps = tps.map((tp) => ({
      ...tp,
      materias_tps_problemas: tp.materias_tps_problemas.filter((mp) =>
        mp.problemas.text_normalized.includes(text)
      ),
    }));
  }

  return (
    <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
      {tps.map(
        ({ id_tps, materias_tps_problemas, name, number, year }, index) => (
          <li key={index} className="relative">
            <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1">
              {numberIcons[number] ? numberIcons[number] : numberIcons[0]}
              <h2>{name}</h2>
            </div>
            <ul className="flex flex-col gap-4 pl-3">
              {materias_tps_problemas.map(({ problemas, number }, index) => (
                <li
                  key={index}
                  className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1"
                >
                  {problemas.response_plus ? (
                    <div className="relative grid grid-cols-[4fr_3fr] grid-rows-[minmax(10rem,1fr)] bg-[#C8E0E4] p-1 rounded-md">
                      <p className="whitespace-pre-wrap">{problemas.text}</p>
                      <div className="relative h-full">
                        <Image
                          className="object-contain"
                          src={`${problemas.response_plus}.${problemas.type_plus}`}
                          fill={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          alt="Imagen"
                          priority
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap bg-[#C8E0E4] p-1 rounded-md">
                      <b>{`Problema ${number}:`}</b>
                      <br />
                      {problemas.text}
                    </p>
                  )}
                  <div className="relative w-full aspect-video">
                    <Image
                      className="object-contain"
                      src={`${problemas.response}.${problemas.type}`}
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt="Imagen"
                      priority
                    />
                  </div>
                </li>
              ))}
            </ul>
          </li>
        )
      )}
    </ul>
  );
}
