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
        mode: 'insensitive',
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
      ttl: 7200,
      swr: 300,
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
      ttl: 7200,
      swr: 300,
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
      ttl: 7200,
      swr: 300,
    },
  });
  return enabler;
}

//fetchs a TPs
export async function fetchTps({
  text,
  id_tps,
  id_materias,
  withProblems,
}: {
  text?: string;
  id_tps?: number;
  id_materias?: number;
  withProblems?: boolean;
}) {
  const tps = await prisma.tps.findMany({
    include: {
      tps_problems: {
        select: {
          problems: {
            include: {
              user_reactions: {},
            },
          },
        },
      },
    },
    ...(withProblems ? {} : {}), //colocar el take:1 pero cuando mejores la logica
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
                    mode: 'insensitive',
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
      ttl: 7200,
      swr: 300,
    },
  });
  return tps;
}

//fetch de carreras
export async function fetchDegree() {
  const degrees = await prisma.degrees.findMany({
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });

  return degrees;
}

//fetch de años -- 1°, 2°, etc
export async function fetchYears() {
  const years = await prisma.years.findMany({
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return years;
}

//fetch a los links de cada materia
export async function fetchLinks({
  official,
  id_materia,
}: {
  official: boolean;
  id_materia: number;
}) {
  const links = await prisma.links.findMany({
    where: {
      courses_links: {
        some: {
          courses_id: id_materia,
        },
      },
      official: official,
    },
    cacheStrategy: {
      ttl: 7200,
      swr: 300,
    },
  });
  return links;
}

export async function fetchUser(ip: string) {
  const idUser = await prisma.users.findFirst({
    where: {
      ip: ip,
    },
  });
  return idUser;
}
