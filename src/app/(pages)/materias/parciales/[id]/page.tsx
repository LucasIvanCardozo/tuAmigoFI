import { courseUseCases } from '@/app/lib/server/usecases/course.usecases';
import { midtermUseCases } from '@/app/lib/server/usecases/midterm.usecases';
import { userUseCases } from '@/app/lib/server/usecases/user.usecases';
import { visibleModules } from '@/app/utils/reportedModules';
import { MainModule } from '../../../../components/feature/materias/mainModule';

interface Params {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ idModule: string | undefined }>;
}

export default async function Practica({ params, searchParams }: Params) {
  const { id } = await params;
  const { idModule } = await searchParams;
  const [course, modules] = await Promise.all([
    courseUseCases.getById(id),
    midtermUseCases.findByCourseIdWithAllData(id),
  ]);
  const session = await userUseCases.getSession();

  return (
    <MainModule
      modules={visibleModules(modules, session?.user.tier === 2)}
      course={course}
      initialIdModule={idModule}
      typeModule="Practica"
    />
  );
}
