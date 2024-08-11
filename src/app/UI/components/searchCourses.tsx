'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isHandleSearch, setIsHandleSearch] = useState(false);
  const [name, setName] = useState<string>(
    searchParams.get('name')?.toString() || ''
  );

  useEffect(() => {
    if (!isHandleSearch) {
      setName(searchParams.get('name')?.toString() || '');
    }
    setIsHandleSearch(false);
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((name: string) => {
    setIsHandleSearch(true);
    const params = new URLSearchParams(searchParams);
    if (name) {
      params.set('name', name);
    } else {
      params.delete('name');
    }
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
      value={name}
      onChange={(e) => (setName(e.target.value), handleSearch(e.target.value))}
    />
  );
}
