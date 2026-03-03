import db from '../db/db'
import { responseRepository } from '../db/repository/response.respository'

export const responseUseCases = {
  findFromTp(idTp: string) {
    return responseRepository(db).findFromTp(idTp)
  },
  findFromMidterm(idMidterm: string) {
    return responseRepository(db).findFromMidterm(idMidterm)
  },
}
