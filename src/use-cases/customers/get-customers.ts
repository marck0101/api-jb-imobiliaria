import { ICustomer } from '@/@types/customer';
import { CustomerRepository } from '@/repositories/customers-repository';
import { ResourceNotFoundError } from '@/utils';

export class GetCustomersUseCase {
  constructor(private repository: CustomerRepository) {}

  async execute(_id: string): Promise<ICustomer> {
    const customers = await this.repository.getById(_id);
    if (!customers) {
      throw new ResourceNotFoundError({ data: { _id } });
    }
    return customers;
  }
}
