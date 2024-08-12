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
            <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
              {numberIcons[number] ? numberIcons[number] : numberIcons[0]}
              <h2>{name}</h2>
            </div>
            <ul className="flex flex-col gap-1 pl-3">
              {materias_tps_problemas.map(({ problemas, number }, index) => (
                <li
                  key={index}
                  className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1"
                >
                  <p className="whitespace-pre-wrap bg-[#C8E0E4] p-1 rounded-md">
                    <b className="bg-[#92C1C9] rounded-sm">{`Problema ${number}:`}</b>
                    <br />
                    {problemas.response_plus ? (
                      <span
                        className={`${
                          problemas.text.length > 200
                            ? 'grid-cols-[1fr] grid-rows-[1fr,min]'
                            : 'grid-cols-[1fr] grid-rows-[min,1fr]'
                        } relative grid bg-[#C8E0E4] p-1`}
                      >
                        <span className="whitespace-pre-wrap pb-1 pr-1">
                          {problemas.text}
                        </span>
                        <span className="relative max-h-96 flex">
                          <Image
                            className="object-contain"
                            src={`${problemas.response_plus}.${problemas.type_plus}`}
                            width={500}
                            height={500}
                            alt="Imagen"
                            priority
                          />
                        </span>
                      </span>
                    ) : (
                      <span className="whitespace-pre-wrap">
                        {problemas.text}
                      </span>
                    )}
                  </p>
                  {problemas.response ? (
                    <div className="relative flex justify-center w-full">
                      <Image
                        className="object-contain"
                        src={`${problemas.response}.${problemas.type}`}
                        width={500}
                        height={500}
                        alt="Imagen"
                        priority
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </li>
              ))}
            </ul>
          </li>
        )
      )}
    </ul>
  );
}
