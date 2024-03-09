import { ICasa } from '@/@types/casa';
import { CasaRepository } from '@/repositories/casa-repository';

export class FetchCasaUseCase {
  constructor(private repository: CasaRepository) {}

  async execute(): Promise<Array<ICasa>> {
    const casa = await this.repository.get({
      archivedAt: { $exists: false },
    });
    return casa;
  }
}
