'use server'
import { boolean, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'

const schema = object({
  idCourse: string().min(1),
  name: string().min(1),
  link: string().min(1),
  official: boolean(),
  idUser: string().min(1),
})

export const addLink = createAction(schema, async ({ idCourse, name, link, official, idUser }) => {
  return db.link.create({
    data: {
      idCourse,
      name: name,
      link: link,
      official: official,
      idUser,
    },
  })
})
