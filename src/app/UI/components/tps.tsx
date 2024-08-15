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
import Problem from './problem';

export default async function Tps({
  tp,
  idUser,
  ipUser,
}: {
  tp: {
    tps_problems: {
      problems: {
        number: number | null;
        id: number;
        text: string;
        text_normalized: string;
        response: string | null;
        type: string | null;
        response_plus: string | null;
        type_plus: string | null;
        user_reactions: {
          id: number;
          id_problem: number;
          reaction: number;
          id_user: number;
          created_at: Date | null;
        }[];
      };
    }[];
  } & {
    id: number;
    name: string;
    number: number | null;
    year: number;
  };
  idUser?: number;
  ipUser: string;
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
  return (
    <li key={tp.id} className="relative">
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
        {tp.number && numberIcons[tp.number]
          ? numberIcons[tp.number]
          : numberIcons[0]}
        <h2>
          {tp.name} <p className="inline-block text-base">{`(${tp.year})`}</p>
        </h2>
      </div>
      <ul className="flex flex-col gap-1 pl-3">
        {tp.tps_problems.map(({ problems }, index) => (
          <Problem
            ipUser={ipUser}
            idUser={idUser}
            problems={problems}
            key={index}
          />
        ))}
      </ul>
    </li>
  );
}
