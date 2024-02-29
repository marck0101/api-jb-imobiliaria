import {
  TripsRepository,
  ITripRepository,
} from '@/repositories/trips-repository';

export class GetTripUseCase {
  constructor(private repository: TripsRepository) {}
  async execute(_id: string) {
    const trips = await this.repository.getById(_id);
    return trips;
  }
}

// async execute(query: { [k: string]: string } = {}) {
//   const [data, count] = await Promise.all([
//     this.repository.get(query),
//     this.repository.count(
//       (query?.filter || {}) as ITripRepository.GetFilterParams,
//     ),
//   ]);

//   return { data, count };
// }
