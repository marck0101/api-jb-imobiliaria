import {
  CteosRepository,
  ICteosRepository,
} from '@/repositories/cteos-repository';

export class FetchCteosUseCase {
  constructor(private repository: CteosRepository) {}

  async execute(query: { [k: string]: string } = {}) {
    const [data, count] = await Promise.all([
      this.repository.get(query),
      this.repository.count(
        (query?.filter || {}) as ICteosRepository.GetFilterParams,
      ),
    ]);

    return { data, count };
  }
}
