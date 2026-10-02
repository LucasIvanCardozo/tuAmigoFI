'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useLoaderPending } from '@/app/contexts/LoaderContext';

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get('search')?.toString() || '';
  const [search, setSearch] = useState<string>(urlSearch);
  const lastUrlSearch = useRef(urlSearch);

  useLoaderPending(isPending);

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
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
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
        handleSearch(e.target.value);
      }}
    />
  );
}
