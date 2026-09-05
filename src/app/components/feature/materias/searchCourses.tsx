'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { handleLoader } from '@/app/utils/handleLoader';

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const urlSearch = searchParams.get('search')?.toString() || '';
  const [search, setSearch] = useState<string>(urlSearch);
  const lastUrlSearch = useRef(urlSearch);

  useEffect(() => {
    if (urlSearch !== lastUrlSearch.current) {
      lastUrlSearch.current = urlSearch;
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  const handleSearch = useDebouncedCallback((value: string) => {
    const normalized = value ? normalize(value) : '';
    lastUrlSearch.current = normalized;
    const params = new URLSearchParams(searchParams);
    if (normalized) {
      params.set('search', normalized);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <input
      type="search"
      name="search"
      id="search"
      autoComplete="off"
      placeholder="Ingresar tu materia"
      className="p-1 grow"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        handleLoader(true);
        handleSearch(e.target.value);
      }}
    />
  );
}
