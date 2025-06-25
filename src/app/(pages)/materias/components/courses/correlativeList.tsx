'use client';
import Link from 'next/link';

export default function CorrelativeList({
  index,
  name,
}: {
  index: number;
  name: string;
}) {

  return (
    <div className="flex">
      {index != 0 && <span className="flex whitespace-pre"> - </span>}
      <Link
        className="whitespace-nowrap min-h-6 hover:text-[--midnight-green] hover:underline"
        href={`https://tuamigofi.ar/materias?search=${name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')}`}
      >
        {name}
      </Link>
    </div>
  );
}
