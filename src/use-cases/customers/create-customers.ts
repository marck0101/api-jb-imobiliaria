/* eslint-disable quotes */
import { ICustomer } from '@/@types/customer';
import { CustomerRepository } from '@/repositories/customers-repository';
import { DuplicateConflictError } from '@/utils';

type Params = Omit<ICustomer, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>;

export class CreateCustomerUseCase {
  constructor(private repository: CustomerRepository) { }

  async execute(data: Params): Promise<ICustomer> {

    if (data.cpf) {
      const buscaCpfExistente = await this.repository.getCpf(data.cpf);
      if (buscaCpfExistente) {
        throw new DuplicateConflictError({
          UIDescription: { 'pt-br': 'Esse CPF já está sendo utilizado!' },
        });
      }
    }

    if (data.cnpj) {
      const buscaCnpjExistente = await this.repository.getCnpj(data.cnpj);
      if (buscaCnpjExistente) {
        throw new DuplicateConflictError({
          UIDescription: { 'pt-br': 'Esse CNPJ já está sendo utilizado!' },
        });
      }
    }

    if (data.phone) {
      const buscaPhoneExistente = await this.repository.getPhone(data.phone.replace(/\D/g, ''));
      if (buscaPhoneExistente) {
        throw new DuplicateConflictError({
          UIDescription: { 'pt-br': 'Esse telefone já está sendo utilizado!' },
        });
      }
    }

    if (data.rg) {
      const buscaRgExistente = await this.repository.getRg(data.rg);
      if (buscaRgExistente) {
        throw new DuplicateConflictError({
          UIDescription: { 'pt-br': 'Esse RG já está sendo utilizado!' },
        });
      }
    }

    if (data.email) {
      const buscaEmailExistente = await this.repository.getEmail(data.email);
      if (buscaEmailExistente) {
        throw new DuplicateConflictError({
          UIDescription: { 'pt-br': 'Esse e-mail já está sendo utilizado!' },
        });
      }
    }

    const customer = {
      ...data,
      phone: data.phone.replace(/\D/g, '')
    };

    return await this.repository.create(customer);

  }
}
