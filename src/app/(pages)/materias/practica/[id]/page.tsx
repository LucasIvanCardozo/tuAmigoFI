import { courseUseCases } from '@/app/lib/server/usecases/course.usecases';
import { tpUseCases } from '@/app/lib/server/usecases/tp.usecases';
import { userUseCases } from '@/app/lib/server/usecases/user.usecases';
import { visibleModules } from '@/app/utils/reportedModules';
import { MainModule } from '../../../../components/feature/materias/mainModule';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ idModule: string | undefined }>;
}

export default async function Practica({ params, searchParams }: Props) {
  const { id } = await params;
  const { idModule } = await searchParams;
  const [course, modules] = await Promise.all([
    courseUseCases.getById(id),
    tpUseCases.findByCourseIdWithAllData(id),
  ]);
  const session = await userUseCases.getSession();

  return (
    <MainModule
      modules={visibleModules(modules, session?.user.tier === 2)}
      course={course}
      typeModule="TP"
      initialIdModule={idModule}
    />
  );
}
