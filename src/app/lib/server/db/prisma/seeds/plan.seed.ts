import { PrismaClient } from '../prismaClient/client'

export const planSeed = async (db: PrismaClient) => {
  const plans = await db.plan.findMany()
  if (!plans.length)
    await db.plan.createMany({
      data: [
        {
          year: 2003,
        },
        {
          year: 2010,
        },
        {
          year: 2024,
        },
      ],
    })
}
