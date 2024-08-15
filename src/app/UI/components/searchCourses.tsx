'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isHandleSearch, setIsHandleSearch] = useState(false);
  const [search, setSearch] = useState<string>(
    searchParams.get('name')?.toString() || ''
  );

  useEffect(() => {
    if (!isHandleSearch) {
      setSearch(searchParams.get('search')?.toString() || '');
    }
    setIsHandleSearch(false);
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((search: string) => {
    setIsHandleSearch(true);
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set(
        'search',
        search.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <input
      type="search"
      name="search"
      id="search"
      autoComplete="off"
      placeholder="Ingresar tu materia"
      className="p-1 grow"
      value={search}
      onChange={(e) => (
        setSearch(e.target.value), handleSearch(e.target.value)
      )}
    />
  );
}
