'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CorrelativeList({
  index,
  name,
  name_normalized,
}: {
  index: number;
  name: string;
  name_normalized: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex">
      {index != 0 ? <p>&nbsp;-&nbsp;</p> : ''}
      <button
        className="hover:text-[--midnight-green] hover:underline"
        onClick={() => handleClick(name)}
      >
        {name}
      </button>
    </div>
  );
}