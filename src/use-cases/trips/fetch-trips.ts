import {
  TripsRepository,
  ITripRepository,
} from '@/repositories/trips-repository';

export class FetchTripsUseCase {
  constructor(private repository: TripsRepository) {}

  async execute(query: { [k: string]: string } = {}) {
    if (query.filter) {
      query.filter.archivedAt = { $exists: false };
    } else {
      query.filter = { archivedAt: { $exists: false } };
    }

    const [data, count] = await Promise.all([
      this.repository.get(query),
      this.repository.count(
        (query?.filter || {}) as ITripRepository.GetFilterParams,
      ),
    ]);

    return { data, count };
  }
}
