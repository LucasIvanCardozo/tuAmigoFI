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

  const handleClick = (name: string) => {
    const params = new URLSearchParams(searchParams);
    if (name) {
      params.set('name', name);
    } else {
      params.delete('name');
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex">
      {index != 0 ? <p>&nbsp;-&nbsp;</p> : ''}
      <button
        className="hover:text-[--midnight-green] hover:underline"
        onClick={() => handleClick(name_normalized)}
      >
        {name}
      </button>
    </div>
  );
}
