import { CasaRepository } from '@/repositories/casa-repository';

export class GetCasaUseCase {
  constructor(private repository: CasaRepository) {}
  async execute(_id: string) {
    const casa = await this.repository.getById(_id);
    return casa;
  }
}
