'use client';
// import { fetchContributor } from '@/app/lib/data';
import { useEffect, useState } from 'react';

export default function ContributorName({ dni }: { dni: number }) {
  const [name, setName] = useState<string>();

  useEffect(() => {
    // const dataFetch = async () => {
    //   const contributor = await fetchContributor(dni);
    //   setName(contributor.name);
    // };
    // dataFetch();
  }, []);
  return dni && name ? (
    <span>
      <b>{`${name} subió este problema`}</b>
    </span>
  ) : (
    <span>Cargando...</span>
  );
}
