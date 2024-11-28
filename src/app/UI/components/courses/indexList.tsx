'use client';
import { fetchCourseCount } from '@/app/lib/data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import IndexLi from './indexLi';

export default function IndexList({
  query,
}: {
  query: { search?: string; year?: number; degree?: number; page?: number };
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [pageCount, setPageCount] = useState<number>();
  const [page, setPage] = useState<number>(query.page || 1);

  useEffect(() => {
    const dataFetch = async () => {
      const coursesCount = await fetchCourseCount(query);
      setPageCount(Math.ceil(coursesCount / 5));
    };
    dataFetch();
  }, []);

  useEffect(() => {
    setPageCount(undefined);
    if (searchParams.get('page')) {
      setPage(Number(searchParams.get('page')));
    }
    const dataFetch = async () => {
      const coursesCount = await fetchCourseCount(query);
      setPageCount(Math.ceil(coursesCount / 5));
    };
    dataFetch();
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

  return pageCount ? (
    pageCount > 1 ? (
      <ul className="flex items-center text-[--black] select-none">
        <IndexLi index={1} page={page} modifier={0} callback={handlePage} />
        {pageCount > 8 && page > 5 && <li>...</li>}
        {pageCount <= 8
          ? [...Array(pageCount - 2)].map((_, index) => (
              <IndexLi
                key={index}
                index={index}
                page={page}
                modifier={2}
                callback={handlePage}
              />
            ))
          : page <= 5
          ? [...Array(6)].map((_, index) => (
              <IndexLi
                key={index}
                index={index}
                page={page}
                modifier={2}
                callback={handlePage}
              />
            ))
          : page >= pageCount - 4
          ? [...Array(5)].map((_, index) => (
              <IndexLi
                key={index}
                index={index}
                page={page}
                modifier={pageCount - 5}
                callback={handlePage}
              />
            ))
          : [...Array(5)].map((_, index) => (
              <IndexLi
                key={index}
                index={index}
                page={page}
                modifier={page - 2}
                callback={handlePage}
              />
            ))}
        {pageCount > 8 && page < pageCount - 4 && <li>...</li>}
        <IndexLi
          index={pageCount}
          page={page}
          modifier={0}
          callback={handlePage}
        />
      </ul>
    ) : null
  ) : pageCount != undefined ? (
    <p className="opacity-75 text-[--black]">No se encuentran datos</p>
  ) : (
    <p className="text-[--black]">Cargando</p>
  );
}
