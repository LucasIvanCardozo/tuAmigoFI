import { PrismaClient } from '../prismaClient/client'

export const degreeSeed = async (db: PrismaClient) => {
  const degrees = await db.degree.findMany()
  if (!degrees.length)
    await db.degree.createMany({
      data: [
        {
          name: 'Ingeniería Eléctrica',
        },
        {
          name: 'Ingeniería Informática',
        },
        {
          name: 'Ingeniería Electromecánica',
        },
        {
          name: 'Ingeniería Electrónica',
        },
        {
          name: 'Ingeniería en Alimentos',
        },
        {
          name: 'Ingeniería Química',
        },
        {
          name: 'Ingeniería en Computación',
        },
        {
          name: 'Ingeniería en Materiales',
        },
        {
          name: 'Ingeniería Industrial',
        },
        {
          name: 'Ingeniería en Mecánica',
        },
      ],
    })
}
