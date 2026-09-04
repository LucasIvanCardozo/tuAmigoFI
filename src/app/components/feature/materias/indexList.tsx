'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import type { CourseSearchParams } from '../../../(pages)/materias/page';
import IndexLi from './indexLi';

export default function IndexList({
  query,
  callback,
}: {
  query: CourseSearchParams;
  callback: Promise<number>;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const amount = use(callback);
  const total = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;

  const [page, setPage] = useState<number>(Number(query.page) || 1);

  useEffect(() => {
    if (searchParams.get('page')) {
      setPage(Number(searchParams.get('page')));
    }
  }, [searchParams]);

  const handlePage = (page: string) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set('page', page);
    } else {
      params.delete('page');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return total === 0 ? (
    <p className="text-(--black)">Cargando</p>
  ) : total === 0 ? (
    <p className="opacity-75 text-(--black)">No se encuentran datos</p>
  ) : (
    <ul className="flex items-center text-(--black) select-none">
      <IndexLi index={1} page={page} modifier={0} callback={handlePage} />
      {total > 8 && page > 5 && <li>...</li>}
      {total <= 8
        ? Array.from({ length: Math.max(0, total - 2) }).map((_, offset) => {
            const pageNumber = offset + 2;
            return (
              <IndexLi
                key={pageNumber}
                index={offset}
                page={page}
                modifier={2}
                callback={handlePage}
              />
            );
          })
        : page <= 5
          ? Array.from({ length: 6 }).map((_, offset) => {
              const pageNumber = offset + 2;
              return (
                <IndexLi
                  key={pageNumber}
                  index={offset}
                  page={page}
                  modifier={2}
                  callback={handlePage}
                />
              );
            })
          : page >= total - 4
            ? Array.from({ length: 5 }).map((_, offset) => {
                const pageNumber = offset + (total - 5);
                return (
                  <IndexLi
                    key={pageNumber}
                    index={offset}
                    page={page}
                    modifier={total - 5}
                    callback={handlePage}
                  />
                );
              })
            : Array.from({ length: 5 }).map((_, offset) => {
                const pageNumber = offset + (page - 2);
                return (
                  <IndexLi
                    key={pageNumber}
                    index={offset}
                    page={page}
                    modifier={page - 2}
                    callback={handlePage}
                  />
                );
              })}
      {total > 8 && page < total - 4 && <li>...</li>}
      {total > 1 && <IndexLi index={total} page={page} modifier={0} callback={handlePage} />}
    </ul>
  );
}
