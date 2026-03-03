import { PrismaClient } from '../prismaClient/client'

export const yearSeed = async (db: PrismaClient) => {
  const years = await db.year.findMany()
  if (!years.length)
    await db.year.createMany({
      data: [
        {
          name: '1°Año',
        },
        {
          name: '2°Año',
        },
        {
          name: '3°Año',
        },
        {
          name: '4°Año',
        },
        {
          name: '5°Año',
        },
        {
          name: '6°Año',
        },
      ],
    })
}
