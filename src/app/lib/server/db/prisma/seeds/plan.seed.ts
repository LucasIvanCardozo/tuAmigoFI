import { PrismaClient } from '../prismaClient/client'

export const planSeed = async (db: PrismaClient) => {
  const plans = await db.plan.findMany()
  if (!plans.length) {
    await db.plan.create({
      data: {
        year: 2003,
        degrees_plans: {
          create: [
            { degrees: { connect: { name: 'Ingeniería Eléctrica' } } },
            { degrees: { connect: { name: 'Ingeniería Electromecánica' } } },
            { degrees: { connect: { name: 'Ingeniería Electrónica' } } },
            { degrees: { connect: { name: 'Ingeniería en Alimentos' } } },
            { degrees: { connect: { name: 'Ingeniería Industrial' } } },
            { degrees: { connect: { name: 'Ingeniería Mecánica' } } },
            { degrees: { connect: { name: 'Ingeniería Química' } } },
            { degrees: { connect: { name: 'Ingeniería en Materiales' } } },
          ],
        },
      },
    })
    await db.plan.create({
      data: {
        year: 2010,
        degrees_plans: {
          create: [
            { degrees: { connect: { name: 'Ingeniería en Computación' } } },
            { degrees: { connect: { name: 'Ingeniería Informática' } } },
          ],
        },
      },
    })
    await db.plan.create({
      data: {
        year: 2024,
        degrees_plans: {
          create: [
            { degrees: { connect: { name: 'Ingeniería Eléctrica' } } },
            { degrees: { connect: { name: 'Ingeniería Electromecánica' } } },
            { degrees: { connect: { name: 'Ingeniería Electrónica' } } },
            { degrees: { connect: { name: 'Ingeniería en Alimentos' } } },
            { degrees: { connect: { name: 'Ingeniería Industrial' } } },
            { degrees: { connect: { name: 'Ingeniería Mecánica' } } },
            { degrees: { connect: { name: 'Ingeniería Química' } } },
            { degrees: { connect: { name: 'Ingeniería en Computación' } } },
            { degrees: { connect: { name: 'Ingeniería en Materiales' } } },
            { degrees: { connect: { name: 'Ingeniería Informática' } } },
          ],
        },
      },
    })
  }
}
