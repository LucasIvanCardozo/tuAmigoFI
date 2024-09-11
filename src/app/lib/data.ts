'use server';
import prisma from './db';

const cache = {
  ttl: 7200,
  swr: 300,
};

// fetching de contribuidores
export async function fetchContributor(id: number) {
  const contributor = await prisma.contributors.findFirstOrThrow({
    where: {
      dni: id,
    },
    cacheStrategy: cache,
  });
  return contributor;
}

export async function fetchContributors() {
  const contributors = await prisma.contributors.findMany({
    where: {
      problems: {
        some: {
          response: true,
        },
      },
    },
    include: {
      _count: {
        select: {
          problems: true,
        },
      },
    },
    orderBy: {
      problems: {
        _count: 'desc',
      },
    },
    cacheStrategy: cache,
  });
  return contributors;
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

export async function fetchCourses({
  search,
  year,
  degree,
}: {
  search?: string;
  year?: number;
  degree?: number;
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
      courses: {
        id: id_materias,
      },
    },
    orderBy: {
      id: 'asc',
    },
    cacheStrategy: cache,
  });
  return midterms;
}

export async function fetchProblemsMidterms({
  id_midterm,
  text,
}: {
  id_midterm: number;
  text?: string;
}) {
  const problems = await prisma.problems.findMany({
    where: {
      id_midterms: id_midterm,
      text_normalized: {
        contains: text,
        mode: 'insensitive',
      },
    },
    cacheStrategy: cache,
  });
  return problems;
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
      tps_courses: {
        some: {
          courses_id: id_materias,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
    cacheStrategy: cache,
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
      courses_links: {
        some: {
          courses_id: id_materia,
        },
      },
      official: official,
    },
    cacheStrategy: cache,
  });
  return links;
}

export async function fetchUser(uuid: string) {
  const uuidUser = await prisma.users.findFirst({
    where: {
      id: uuid,
    },
  });
  return uuidUser;
}

export async function fetchUserReaction(id_problem: number) {
  const userReactions = await prisma.user_reactions.findMany({
    where: {
      id_problem: id_problem,
    },
  });
  return userReactions;
}

export async function fetchProblems({
  id_tp,
  text,
}: {
  id_tp: number;
  text?: string;
}) {
  const problems = await prisma.problems.findMany({
    where: {
      text_normalized: {
        contains: text,
        mode: 'insensitive',
      },
      tps_problems: {
        some: {
          tps_id: id_tp,
        },
      },
    },
    orderBy: {
      number: 'asc',
    },
    cacheStrategy: cache,
  });
  return problems;
}

export async function fetchProblem({ id }: { id: number }) {
  const problem = await prisma.problems.findUniqueOrThrow({
    where: {
      id: id,
    },
    cacheStrategy: cache,
  });
  return problem;
}
