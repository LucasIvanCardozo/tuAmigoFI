import { fetchContributors } from '@/app/lib/data';

export default async function Contributors() {
  const contributors = await fetchContributors();
  return (
    <section className="text-[--black] relative max-w-screen-md m-auto w-11/12 h-96">
      <h2 className="font-bold text-3xl my-2">Colaboradores</h2>
      <ul>
        {contributors.map(({ _count, name }, index) => (
          <li
            key={index}
          >{`${name}: gracias por tus ${_count.problems} problemas resueltos <3`}</li>
        ))}
      </ul>
    </section>
  );
}
