import { DatabaseError } from '@/utils'
import { CasaRepository } from '../casa-repository'
import { ICasa } from '@/@types/casa'
import { Casa } from '@/models/casa'

export class MongoCasaRepository implements CasaRepository {
  async create(
    data: Omit<ICasa, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>
  ) {
    // console.log('data', data);
    try {
      const casa = new Casa(data)
      await casa.save()
      return casa
    } catch (e) {
      throw new DatabaseError({ data })
    }
  }
}
