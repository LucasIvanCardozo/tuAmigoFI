'use server';
import prisma from './db';

const cache = {
  ttl: 7200,
  swr: 300,
};

// fetching de materias
export async function fetchCourse(id: number) {
  const course = await prisma.courses.findFirstOrThrow({
    where: {
      id: id,
    },
    cacheStrategy: cache,
  });
  return course;
}

export async function fetchCourseCount(query: {
  search?: string;
  year?: number;
  degree?: number;
}) {
  const count = await prisma.courses.count({
    where: {
      name_normalized: {
        contains: query.search,
        mode: 'insensitive',
      },
      ...(query.year
        ? {
            courses_years: {
              some: {
                years_id: query.year,
              },
            },
          }
        : {}),
      ...(query.degree
        ? {
            courses_degrees: {
              some: {
                degrees_id: query.degree,
              },
            },
          }
        : {}),
    },
  });
  return count;
}

export async function fetchCourses({
  search,
  year,
  degree,
  page,
}: {
  search?: string;
  year?: number;
  degree?: number;
  page?: number;
}) {
  const courses = await prisma.courses.findMany({
    where: {
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
    orderBy: {
      name: 'asc',
    },
    ...(page
      ? {
          take: 5,
          skip: (page - 1) * 5,
        }
      : { take: 5, skip: 0 }),
    cacheStrategy: cache,
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
    },
    cacheStrategy: cache,
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
    cacheStrategy: cache,
  });
  return enabler;
}

//fetch a parciales
export async function fetchMidterms({
  id_midterm,
  id_materias,
}: {
  id_midterm?: number;
  id_materias: number;
}) {
  const midterms = await prisma.midterms.findMany({
    where: {
      id: id_midterm,
      id_course: id_materias,
    },
    orderBy: {
      id: 'asc',
    },
    // cacheStrategy: cache,
  });
  return midterms;
}

//fetchs a TPs
export async function fetchTps({
  id_tps,
  id_materias,
}: {
  id_tps?: number;
  id_materias: number;
}) {
  const tps = await prisma.tps.findMany({
    where: {
      id: id_tps,
      id_course: id_materias,
    },
    orderBy: {
      number: 'asc',
    },
    // cacheStrategy: cache,
  });
  return tps;
}

//fetch de carreras
export async function fetchDegrees() {
  const degrees = await prisma.degrees.findMany({
    include: {
      degrees_plans: {
        select: {
          plans: true,
        },
        orderBy: {
          plans: {
            year: 'asc',
          },
        },
      },
    },
    cacheStrategy: cache,
  });

  return degrees;
}

//fetch de años -- 1°, 2°, etc
export async function fetchYears() {
  const years = await prisma.years.findMany({
    cacheStrategy: cache,
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
      id_course: id_materia,
      official: official,
    },
    cacheStrategy: cache,
  });
  return links;
}

export async function fetchUser(id: number | string) {
  let user;
  if (typeof id === 'number') {
    user = await prisma.users.findFirst({
      where: {
        id: id,
      },
    });
  } else if (typeof id === 'string') {
    user = await prisma.users.findFirst({
      where: {
        email: id,
      },
    });
  }
  return user;
}

export async function fetchUserReactionTp(id_response: number) {
  const userReactions = await prisma.tps_reactions.findMany({
    where: {
      id_response: id_response,
    },
  });
  return userReactions;
}

export async function fetchUserReactionMidterm(id_response: number) {
  const userReactions = await prisma.midterms_reactions.findMany({
    where: {
      id_response: id_response,
    },
  });
  return userReactions;
}

export async function fetchResponsesTp({ id_tp }: { id_tp: number }) {
  const responses = await prisma.tps_responses.findMany({
    where: {
      id_tp: id_tp,
    },
    include: {
      tps_reactions: true,
    },
    orderBy: {
      number: 'asc',
    },
  });

  const groupedResponses = responses.reduce<Record<number, any>>(
    (acc, response) => {
      const { number, tps_reactions } = response;

      const score =
        tps_reactions.filter((reaction) => reaction.reaction).length -
        tps_reactions.filter((reaction) => reaction.reaction).length;

      if (!acc[number]) {
        acc[number] = [];
      }

      acc[number].push({ ...response, score });
      acc[number].sort((a: any, b: any) => b.score - a.score);
      return acc;
    },
    {}
  );

  return groupedResponses;
}

export async function fetchResponsesMidterm({
  id_midterm,
}: {
  id_midterm: number;
}) {
  const responses = await prisma.midterms_responses.findMany({
    where: {
      id_midterm: id_midterm,
    },
    include: {
      midterms_reactions: true,
    },
    orderBy: {
      number: 'asc',
    },
  });

  const groupedResponses = responses.reduce<Record<number, any>>(
    (acc, response) => {
      const { number, midterms_reactions } = response;

      const score =
        midterms_reactions.filter((reaction) => reaction.reaction)
          .length -
        midterms_reactions.filter((reaction) => reaction.reaction).length;

      if (!acc[number]) {
        acc[number] = [];
      }

      acc[number].push({ ...response, score });
      acc[number].sort((a: any, b: any) => b.score - a.score);
      return acc;
    },
    {}
  );

  return groupedResponses;
}
