'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CorrelativeList({
  index,
  name,
}: {
  index: number;
  name: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (search: string) => {
    const normalizedSearch = search
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const params = new URLSearchParams(searchParams);
    params.set('search', normalizedSearch);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex">
      {index != 0 && <span className="flex whitespace-pre"> - </span>}
      <button
        className="text-nowrap hover:text-[--midnight-green] hover:underline"
        onClick={() => handleClick(name)}
      >
        {name}
      </button>
    </div>
  );
}
