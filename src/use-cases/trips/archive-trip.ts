import { TripsRepository } from '@/repositories/trips-repository';

export class ArchiveTripUseCase {
  constructor(private repository: TripsRepository) {}

  async execute(_id: string) {
    await this.repository.archive(_id);
    // console.log('deletando id =>', _id);
  }
}
