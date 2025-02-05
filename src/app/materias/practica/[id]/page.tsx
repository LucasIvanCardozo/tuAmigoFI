import { fetchCourse, fetchTpsWithAllData } from '@/app/lib/data';
import { DataModule, DataModuleProblem } from '@/app/types';
import { MainModule } from '@/app/UI/components/modules/mainModule';

export default async function Practica({ params }: { params: { id: string } }) {
  const id_materia = Number(params.id);
  const course = await fetchCourse(id_materia);
  const moduleList = await fetchTpsWithAllData(id_materia);
  let modules: DataModule[] = [];

  for (const module of moduleList) {
    const countReposrts = module.tps_reports.length;
    const user = module.users;
    const responses = module.tps_responses;
    let dataModuleProblems: DataModuleProblem[] = [];
    let numAux: number = responses[0]?.number;
    let i = 0;

    if (responses[0])
      dataModuleProblems.push({ number: responses[i].number, responses: [] });

    for (const response of responses) {
      const user = response.users;
      const reactions = response.tps_reactions;
      if (numAux != response.number) {
        dataModuleProblems.push({ number: response.number, responses: [] });
        numAux = response.number;
        i++;
      }
      dataModuleProblems[i].responses.push({
        response: response,
        user: user,
        reactions: reactions,
      });
    }

    for (const moduleProblem of dataModuleProblems) {
      moduleProblem.responses.sort((a, b) => {
        const likesA = a.reactions.filter((rea) => rea.reaction).length;
        const disLikesA = a.reactions.length - likesA;
        const likesB = b.reactions.filter((rea) => rea.reaction).length;
        const disLikesB = b.reactions.length - likesA;
        return likesB - disLikesB - (likesA - disLikesA);
      });
    }

    modules.push({
      module: module,
      countReports: countReposrts,
      user: user,
      problems: dataModuleProblems,
    });
  }

  return <MainModule modules={modules} course={course} typeModule="TP" />;
}
