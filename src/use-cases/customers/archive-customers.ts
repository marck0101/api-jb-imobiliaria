import { CustomerRepository } from '@/repositories/customers-repository';

export class ArchiveCustomerUseCase {
  constructor(private repository: CustomerRepository) {}

  async execute(_id: string): Promise<void> {
    await this.repository.archive(_id);
    // console.log('cheguei aqui para o delete');
    // console.log(_id);
  }
}
