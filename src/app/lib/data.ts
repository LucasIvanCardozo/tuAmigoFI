'use server';
import prisma from './db';

const cache = {
  ttl: 3600 * 24 * 30,
  swr: 3600 * 24,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    cacheStrategy: cache,
  });
  return count;
}

export async function fetchAllCourses() {
  const courses = await prisma.courses.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
    cacheStrategy: cache,
  });
  return courses;
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
    },
    cacheStrategy: cache,
  });
  return enabler;
}

//fetch a parciales
export async function fetchMidterms(id_materias: number) {
  const midterms = await prisma.midterms.findMany({
    where: {
      id_course: id_materias,
    },
    orderBy: {
      id: 'asc',
    },
  });
  return midterms;
}

export async function fetchMidtermsWithAllData(id_materias: number) {
  const tps = await prisma.midterms.findMany({
    where: {
      id_course: id_materias,
    },
    include: {
      midterms_reports: true,
      users: true,
      midterms_responses: {
        include: {
          midterms_reactions: true,
          users: true,
          midterms_comments: {
            include: {
              midterms_comments_reactions: true,
              users: true,
            },
            orderBy: {
              midterms_comments_reactions: {
                _count: 'desc',
              },
            },
          },
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });
  return tps;
}

//fetchs a TPs
export async function fetchTps(id_materias: number) {
  const tps = await prisma.tps.findMany({
    where: {
      id_course: id_materias,
    },
    orderBy: {
      number: 'asc',
    },
  });
  return tps;
}

export async function fetchTpsWithAllData(id_materias: number) {
  const tps = await prisma.tps.findMany({
    where: {
      id_course: id_materias,
    },
    include: {
      tps_reports: true,
      users: true,
      tps_responses: {
        include: {
          tps_reactions: true,
          users: true,
          tps_comments: {
            include: {
              tps_comments_reactions: true,
              users: true,
            },
            orderBy: {
              tps_comments_reactions: {
                _count: 'desc',
              },
            },
          },
        },
        orderBy: {
          number: 'asc',
        },
      },
    },
    orderBy: {
      number: 'asc',
    },
  });
  return tps;
}

//fetch contador de reposrtes a los TPs
export async function fetchReportsTps(id_tps: number) {
  const countReports = await prisma.tps_reports.count({
    where: {
      id_module: id_tps,
    },
  });
  return countReports;
}

//fetch contador de reposrtes a los parciales
export async function fetchReportsMidterms(id_midterms: number) {
  const countReports = await prisma.midterms_reports.count({
    where: {
      id_module: id_midterms,
    },
  });
  return countReports;
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
export async function fetchDegreesWithCourse({
  id_course,
}: {
  id_course: number;
}) {
  const degrees = await prisma.degrees.findMany({
    where: {
      courses_degrees: {
        some: {
          courses_id: id_course,
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
    include: {
      _count: {
        select: {
          links_reports: true,
        },
      },
    },
    // cacheStrategy: cache,
  });
  return links;
}

export async function fetchUser(id: number | string) {
  try {
    const user = await prisma.users.findFirstOrThrow({
      where: {
        ...(typeof id === 'number'
          ? { id: id }
          : typeof id === 'string' && { email: id }),
      },
    });
    return user;
  } catch (error) {
    throw new Error('No se encontro nignun usuario');
  }
}

export async function fetchUserWithoutThrow(id: number | string) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        ...(typeof id === 'number'
          ? { id: id }
          : typeof id === 'string' && { email: id }),
      },
    });
    return user;
  } catch (error) {
    throw new Error('No se encontro nignun usuario');
  }
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

export async function fetchResponsesTp(id_tp: number) {
  const responses = await prisma.tps_responses.findMany({
    where: {
      id_module: id_tp,
    },
    orderBy: {
      number: 'asc',
    },
  });
  return responses;
}

export async function fetchResponsesMidterm(id_midterm: number) {
  const responses = await prisma.midterms_responses.findMany({
    where: {
      id_module: id_midterm,
    },
    orderBy: {
      number: 'asc',
    },
  });

  return responses;
}

export async function fetchContributors() {
  const users = await prisma.users.findMany({
    include: {
      _count: {
        select: {
          links: true,
          midterms: true,
          tps: true,
          tps_responses: true,
          tps_reactions: {
            where: {
              reaction: true,
            },
          },
        },
      },
    },
    cacheStrategy: {
      ttl: 3600 * 24,
      swr: 3600,
    },
  });
  const prepareUsers = users
    .map((user) => ({
      ...user,
      score:
        user._count.links * 1 +
        user._count.midterms * 5 +
        user._count.tps * 6 +
        user._count.tps_reactions * 1 +
        user._count.tps_responses * 3,
    }))
    .filter((user) => user.score > 0)
    .sort((a, b) => b.score - a.score);

  return prepareUsers;
}
