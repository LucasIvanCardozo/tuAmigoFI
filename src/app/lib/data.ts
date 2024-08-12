import prisma from './db';
// fetching de materias
export async function fetchCourses({
  search,
  year,
  degree,
}: {
  search?: string;
  year?: number;
  degree?: number;
}) {
  const courses = await prisma.materias.findMany({
    where: {
      name_normalized: {
        contains: search,
      },
      ...(degree || year
        ? {
            carreras_materias_anios: {
              some: {
                id_carreras: degree != 0 ? degree : undefined,
                id_anios: year != 0 ? year : undefined,
              },
            },
          }
        : {}),
    },
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
    //take: 5,
  });
  return courses;
}

export async function fetchCorrelatives({
  id_materias,
  id_carreras,
}: {
  id_materias: number;
  id_carreras?: number;
}) {
  const correlatives = await prisma.materias.findMany({
    where: {
      materia_correlativa_materia_correlativa_id_correlativaTomaterias: {
        some: {
          id_materias: id_materias,
        },
      },
      ...(id_carreras
        ? {
            carreras_materias_anios: {
              some: {
                id_carreras: id_carreras,
              },
            },
          }
        : {}),
    },
    select: {
      id_materias: true,
      name: true,
      name_normalized: true,
    },
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return correlatives;
}

export async function fetchEnabler({
  id_materias,
  id_carreras,
}: {
  id_materias: number;
  id_carreras?: number;
}) {
  const enabler = await prisma.materias.findMany({
    where: {
      materia_correlativa_materia_correlativa_id_correlativaTomaterias: {
        some: {
          id_correlativa: id_materias,
        },
      },
      ...(id_carreras
        ? {
            carreras_materias_anios: {
              some: {
                id_carreras: id_carreras,
              },
            },
          }
        : {}),
    },
    select: {
      id_materias: true,
      name: true,
      name_normalized: true,
    },
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return enabler;
}

export async function fetchCoursesWhitId(id: number) {
  const materia = await prisma.materias.findUniqueOrThrow({
    where: {
      id_materias: id,
    },
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return materia;
}

//fetchs a TPs
export async function fetchTpsWhitCourse(id_materias: number) {
  const tps = await prisma.tps.findMany({
    where: {
      materias_tps_problemas: {
        some: {
          id_materias: id_materias,
        },
      },
    },
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return tps;
}

//fetch de carreras
export async function fetchDegree() {
  const degrees = await prisma.carreras.findMany({
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });

  return degrees;
}

//fetch de años -- 1°, 2°, etc
export async function fetchYears() {
  const years = await prisma.anios.findMany({
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return years;
}

//fetch de problemas
export async function fetchTpsWithProblemsIn({
  text,
  id_tps,
  id_materias,
}: {
  text?: string;
  id_tps?: number;
  id_materias: number;
}) {
  const tps = await prisma.tps.findMany({
    include: {
      materias_tps_problemas: {
        select: {
          problemas: {},
          number: true,
        },
        orderBy: {
          number: 'asc',
        },
      },
    },
    where: {
      id_tps: id_tps,
      materias_tps_problemas: {
        some: {
          problemas: {
            text_normalized: { contains: text },
          },
          id_materias: id_materias,
        },
      },
    },
    orderBy: {
      id_tps: 'asc',
    },
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return tps;
}
