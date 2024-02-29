/* eslint-disable quotes */
import { ICustomer } from '@/@types/customer';
import { CustomerRepository } from '@/repositories/customers-repository';
import { DuplicateConflictError } from '@/utils';

type Params = Partial<ICustomer>;

export class UpdateCustomersUseCase {
  constructor(private repository: CustomerRepository) { }

  async execute(_id: string, data: Params): Promise<void> {
    const customer = await this.repository.getById(_id); // pega apenas o _id para listar na tela

    if (!customer) {
      throw new Error('Ocorreu um erro');
    }

    if (customer.cpf === data.cpf) {
      delete data.cpf;
    }

    if (customer.cnpj === data.cnpj) {
      delete data.cnpj;
    }

    if (customer.phone === data.phone) {
      delete data.phone;
    }

    if (customer.rg === data.rg) {
      delete data.rg;
    }

    if (customer.email === data.email) {
      delete data.email;
    }

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
      const buscaPhoneExistente = await this.repository.getPhone(data.phone);
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
    await this.repository.update({ _id }, data);
  }
}
