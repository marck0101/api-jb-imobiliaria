import {
  CustomerRepository,
  ICustomerRepository,
} from '@/repositories/customers-repository';

export class FetchCustumersUseCase {
  constructor(private repository: CustomerRepository) { }

  async execute(query: { [k: string]: string | any } = {}) {

    //@ts-ignore
    query.filter = { archivedAt: { $exists: false } };

    if (query.name) {
      query.filter.name = { $regex: new RegExp(query.name, "i") };
      delete query.name;
    }

    const [data, count] = await Promise.all([
      this.repository.get(query),
      this.repository.count(
        (query?.filter || {}) as ICustomerRepository.GetFilterParams,
      ),
    ]);

    return { data, count };
  }

}
