import { fetchTps, fetchUser } from '@/app/lib/data';
import Tps from './tps';

export default async function ProblemsTable({
  query,
}: {
  query: { text?: string; id_tps?: number; id_materias: number };
}) {
  const withProblems = true;
  let tps = await fetchTps({
    text: query.text,
    id_tps: query.id_tps,
    id_materias: query.id_materias,
    withProblems: withProblems,
  });
  if (query.text && withProblems) {
    const text: string = query.text;
    tps = tps.map((tp) => ({
      ...tp,
      tps_problems: tp.tps_problems.filter((mp) =>
        mp.problems.text_normalized.includes(text)
      ),
    }));
  }
  const ipUser: string = await fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then((data) => data.ip);
  const idUser = await fetchUser(ipUser);
  // fetch('https://api.ipify.org/?format=json')
  //   .then((response) => response.json())
  //   .then((data) => {

  //   })
  //   .catch((error) => console.error(error));
  return (
    <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
      {tps.map((tp, index) => (
        <Tps tp={tp} ipUser={ipUser} idUser={idUser?.id} key={index} />
      ))}
    </ul>
  );
}
