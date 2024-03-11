import { ICasa } from '@/@types/casa';
import { CasaRepository } from '@/repositories/casa-repository';
import { ResourceNotFoundError } from '@/utils';

export class GetCasaUseCase {
  constructor(private repository: CasaRepository) {}

  async execute(_id: string): Promise<ICasa> {
    const vehicle = await this.repository.getById(_id);
    if (!vehicle) {
      throw new ResourceNotFoundError({ data: { _id } });
    }
    return vehicle;
  }
}
