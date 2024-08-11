import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchCourses({
  name,
  year,
  degree,
  id_materias,
}: {
  name?: string;
  year?: string;
  degree?: string;
  id_materias?: string;
}) {
  let degreeInt;
  let id_materiasInt;
  let yearInt;
  if (id_materias && id_materias != '0') id_materiasInt = parseInt(id_materias);
  if (degree && degree != '0') degreeInt = parseInt(degree);
  if (year && year != '0') yearInt = parseInt(year);

  const courses = await prisma.materias.findMany({
    where: {
      id_materias: id_materiasInt,
      name_normalized: {
        contains: name,
      },
      carreras_materias_anios: {
        some: {
          id_carreras: degreeInt,
          id_anios: yearInt,
        },
      },
    },
    take: 5,
  });
  return courses;
}

export async function fetchCorrelatives({
  id_materias,
  id_carreras,
}: {
  id_materias: number;
  id_carreras: string;
}) {
  let id_carreraInt;
  if (id_carreras && id_carreras != '0') id_carreraInt = parseInt(id_carreras);

  const correlatives = await prisma.materias.findMany({
    where: {
      materia_correlativa_materia_correlativa_id_correlativaTomaterias: {
        some: {
          id_materias: id_materias,
        },
      },
      carreras_materias_anios: {
        some: {
          id_carreras: id_carreraInt,
        },
      },
    },
    select: {
      id_materias: true,
      name: true,
      name_normalized: true,
    },
  });
  return correlatives;
}

export async function fetchEnabler({
  id_materias,
  id_carreras,
}: {
  id_materias: number;
  id_carreras: string;
}) {
  let id_carreraInt;
  if (id_carreras && id_carreras != '0') id_carreraInt = parseInt(id_carreras);

  const enabler = await prisma.materias.findMany({
    where: {
      materia_correlativa_materia_correlativa_id_correlativaTomaterias: {
        some: {
          id_correlativa: id_materias,
        },
      },
      carreras_materias_anios: {
        some: {
          id_carreras: id_carreraInt,
        },
      },
    },
    select: {
      id_materias: true,
      name: true,
      name_normalized: true,
    },
  });
  return enabler;
}

export async function fetchTpsFromCourse(id_materias: string) {
  let id_materiasInt;
  if (id_materias) id_materiasInt = parseInt(id_materias);
  const tps = await prisma.tps.findMany({
    where: {
      tps_materias: {
        some: {
          id_materias: id_materiasInt,
        },
      },
    },
  });
  return tps;
}

export async function fetchProblems({
  text,
  tps,
  id_materias,
}: {
  text?: string;
  tps?: string;
  id_materias: string;
}) {
  let id_tpsInt;
  let id_materiasInt;
  if (tps) id_tpsInt = parseInt(tps);
  if (id_materias) id_materiasInt = parseInt(id_materias);

  const tpsList = await prisma.tps_materias.findMany({
    where: {
      id_materias: id_materiasInt,
      id_tps: id_tpsInt,
    },
    select: {
      id_tps: true,
    },
  });
  const tpsIds: number[] = tpsList.map((tps) => tps.id_tps);
  const problems = await prisma.problemas.findMany({
    where: {
      text_normalized: {
        contains: text,
      },
      tps_problemas: {
        some: {
          id_tps: {
            in: tpsIds,
          },
        },
      },
    },
  });
  return problems;
}

export async function fetchYearsDegree() {
  const years = await prisma.anios.findMany();
  const degrees = await prisma.carreras.findMany();
  return { years, degrees };
}
