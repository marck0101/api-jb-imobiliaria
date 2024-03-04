import { ICasa } from '@/@types/casa'
import { MongoCasaRepository } from '@/repositories/mongo/mongo-casa-repository '

type Params = Omit<ICasa, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>

export class CreateCasaUseCase {
  constructor(private repository: MongoCasaRepository) {}

  async execute(data: Params): Promise<ICasa> {
    // console.log('data', data);
    const casa = await this.repository.create(data)
    return casa
  }
}
