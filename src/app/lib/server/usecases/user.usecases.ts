import { cacheLife, cacheTag } from 'next/cache'
import db from '../db/db'
import { User } from '../db/prisma/prismaClient/client'
import { userRepository } from '../db/repository/user.repository'

export const userUseCases = {
  async getById(id: string) {
    'use cache'
    cacheLife('hours')
    cacheTag('users')
    return userRepository(db).getById(id)
  },
  async getByEmail(email: string) {
    'use cache'
    cacheLife('hours')
    cacheTag('users')
    return userRepository(db).getByEmail(email)
  },
  async findById(id: string) {
    'use cache'
    cacheLife('hours')
    cacheTag('users')
    return userRepository(db).findById(id)
  },
  async findByEmail(email: string) {
    'use cache'
    cacheLife('hours')
    cacheTag('users')
    return userRepository(db).findByEmail(email)
  },
  async findContributorsWithScore() {
    'use cache'
    cacheLife('hours')
    cacheTag('users')
    const contributors = await userRepository(db).findContributors()
    const data: ContributorsFullType[] = []

    contributors.map((user) => {
      const { comments, links, midterms, reactions, responses, tps } = user._count
      data.push({
        user,
        score: links + midterms * 5 + tps * 6 + reactions + responses * 3 + comments,
      })
    })

    data.sort((a, b) => b.score - a.score)

    return data
  },
}

export type ContributorsFullType = {
  user: User
  score: number
}
