'use server';
import prisma from './db';
import stream from 'stream';
import { promisify } from 'util';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'donzj5rlf',
  api_key: '114644541663818',
  api_secret: 'YJ9B-Goy__55LcSFW5Rcayo1bTg',
});

// Promisify the stream pipeline
const pipeline = promisify(stream.pipeline);

export async function uploadImage({
  buffer,
  imageId,
}: {
  buffer: Buffer;
  imageId: string;
}) {
  try {
    // Create a promise-based upload stream
    const uploadStream = cloudinary.uploader.upload_stream({
      public_id: imageId,
      folder: 'responses',
      format: 'webp',
      quality: '50',
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
    });

    // Use pipeline to manage the stream
    await pipeline(stream.Readable.from(buffer), uploadStream);

    return { ok: true };
  } catch (error) {
    console.error('Upload failed:', error);
    return { ok: false };
  }
}

export async function createContributor(dni: string, name: string) {
  const contributor = await prisma.contributors.create({
    data: {
      dni: dni,
      name: name,
    },
  });
  return contributor;
}

export async function createAnonymus() {
  const existingContributor = await prisma.contributors.findUnique({
    where: {
      dni: '00000000', // Verificamos si el dni ya existe
    },
  });

  if (!existingContributor) {
    // Si no existe, lo creamos
    const contributor = await prisma.contributors.create({
      data: {
        dni: '00000000',
        name: 'Anonymus',
      },
    });
    return contributor;
  }

  // Si ya existe, retornamos el registro existente
  return existingContributor;
}

export async function AddContributor(idProblem: number, dni: string) {
  const problem = await prisma.problems.update({
    where: {
      id: idProblem,
    },
    data: {
      id_contributors: dni,
    },
  });
  return problem;
}

export async function createUser(uuid: string) {
  const user = await prisma.users.create({
    data: {
      id: uuid,
    },
  });
  return user;
}

export async function addReaction({
  uuid,
  id_problem,
  reaction,
}: {
  uuid: string;
  id_problem: number;
  reaction: number;
}) {
  const reactionSearch = await prisma.user_reactions.findFirst({
    where: {
      id_problem: id_problem,
      id_user: uuid,
    },
  });
  if (reactionSearch) {
    if (reaction != reactionSearch.reaction) {
      const updateReaction = await prisma.user_reactions.update({
        where: {
          id: reactionSearch.id,
        },
        data: {
          reaction: reaction,
        },
      });
      return updateReaction;
    } else {
      const deleteReaction = await prisma.user_reactions.delete({
        where: {
          id: reactionSearch.id,
        },
      });
      return deleteReaction;
    }
  } else {
    const createReaction = await prisma.user_reactions.create({
      data: {
        id_problem: id_problem,
        id_user: uuid,
        reaction: reaction,
      },
    });
    return createReaction;
  }
}
