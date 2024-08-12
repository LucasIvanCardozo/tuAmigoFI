import prisma from './db';


// fetching de materias
export async function fetchCourses({
  search,
  year,
  degree,
  id,
}: {
  search?: string;
  year?: number;
  degree?: number;
  id?: number;
}) {
  const courses = await prisma.courses.findMany({
    where: {
      id: id,
      name_normalized: {
        contains: search,
      },
      ...(year
        ? {
            courses_years: {
              some: {
                years_id: year,
              },
            },
          }
        : {}),
      ...(degree
        ? {
            courses_degrees: {
              some: {
                degrees_id: degree,
              },
            },
          }
        : {}),
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
    //take: 5,
  });
  return courses;
}

export async function fetchCorrelatives({
  id,
  id_carreras,
}: {
  id: number;
  id_carreras?: number;
}) {
  const correlatives = await prisma.courses.findMany({
    where: {
      correlatives_correlatives_id_correlativeTocourses: {
        some: {
          id_correlative: id,
        },
      },
      ...(id_carreras
        ? {
            courses_degrees: {
              some: {
                degrees_id: id_carreras,
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      name_normalized: true,
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });
  return correlatives;
}

export async function fetchEnabler({
  id,
  id_carreras,
}: {
  id: number;
  id_carreras?: number;
}) {
  const enabler = await prisma.courses.findMany({
    where: {
      correlatives_correlatives_idTocourses: {
        some: {
          id: id,
        },
      },
      ...(id_carreras
        ? {
            courses_degrees: {
              some: {
                degrees_id: id_carreras,
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      name_normalized: true,
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });
  return enabler;
}

//fetchs a TPs
export async function fetchTps({
  text,
  id_tps,
  id_materias,
}: {
  text?: string;
  id_tps?: number;
  id_materias?: number;
}) {
  const tps = await prisma.tps.findMany({
    include: {
      tps_problems: {
        select: {
          problems: {},
        },
      },
    },
    where: {
      id: id_tps,
      tps_courses: {
        some: {
          courses_id: id_materias,
        },
      },
      ...(text
        ? {
            tps_problems: {
              some: {
                problems: {
                  text_normalized: {
                    contains: text,
                  },
                },
              },
            },
          }
        : {}),
    },
    orderBy: {
      id: 'asc',
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });
  return tps;
}

//fetch de carreras
export async function fetchDegree() {
  const degrees = await prisma.degrees.findMany({
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });

  return degrees;
}

//fetch de años -- 1°, 2°, etc
export async function fetchYears() {
  const years = await prisma.years.findMany({
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });
  return years;
}
