'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchProblems() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isHandleSearch, setIsHandleSearch] = useState(false);
  const [text, setText] = useState<string>(
    searchParams.get('text')?.toString() || ''
  );

  useEffect(() => {
    if (!isHandleSearch) {
      setText(searchParams.get('text')?.toString() || '');
    }
    setIsHandleSearch(false);
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((text: string) => {
    setIsHandleSearch(true);
    const params = new URLSearchParams(searchParams);
    if (text) {
      params.set('text', text);
    } else {
      params.delete('text');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <input
      type="search"
      name="search"
      id="search"
      autoComplete="off"
      placeholder="Ingresa palabras clave de tu probelma"
      className="p-1 w-full"
      value={text}
      onChange={(e) => (setText(e.target.value), handleSearch(e.target.value))}
    />
  );
}
