import { fetchContributors } from '@/app/lib/data';

export default async function Contributors() {
  const contributors = await fetchContributors();
  return (
    <section className="text-[--black] relative max-w-screen-md m-auto w-11/12">
      <h2 className="font-bold text-3xl my-2">Colaboradores</h2>
      <ul>
        {contributors.map(({ _count, name }, index) =>
          index == 0 ? (
            <li
              className="text-2xl"
              key={index}
            >{`🥇${name} resolvió ${_count.problems} problemas!`}</li>
          ) : index == 1 ? (
            <li
              className="text-xl"
              key={index}
            >{`🥈${name} resolvió ${_count.problems} problemas!`}</li>
          ) : index == 2 ? (
            <li
              className="text-lg"
              key={index}
            >{`🥉${name} resolvió ${_count.problems} problemas!`}</li>
          ) : (
            <li key={index}>{`${name} resolvió ${_count} problemas`}</li>
          )
        )}
      </ul>
    </section>
  );
}
