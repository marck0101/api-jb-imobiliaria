import { ICustomer } from '@/@types/customer';
import { Customers } from '@/models/customer';
import { DatabaseError } from '@/utils';
import {
  ICustomerRepository,
  CustomerRepository,
} from '../customers-repository';

export class MongoCustumerRepository implements CustomerRepository {
  async create(
    data: Omit<ICustomer, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>,
  ) {
    try {
      const customers = new Customers(data);
      await customers.save();
      return customers;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }

  async update(
    query: ICustomerRepository.UpdateParams,
    data: Partial<Omit<ICustomer, 'createdAt' | 'updatedAt' | '_id'>>,
  ) {
    try {
      // console.log('query data =>>>', query, data);

      await Customers.updateOne(query, data);
    } catch (e) {
      // console.log('erro aqui', e);
      throw new DatabaseError({ data: { data, query } });
    }
  }

  async archive(_id: string) {
    try {
      // console.log('cheguei aqui para o delete =>', _id);

      const result = await Customers.updateOne(
        { _id },
        { archivedAt: new Date() },
      );
      // console.log('result', result);
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }

  async get(options: ICustomerRepository.GetParams = {}) {
    try {

      const limit = options.limit || 10;
      const skip = options.skip || 0;

      const customers = await Customers.find(
        options.filter || {},
        options.projection || {},
      )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
      return customers;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async count(filter: ICustomerRepository.GetFilterParams) {
    try {
      const customers = await Customers.count(filter || {});
      return customers;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getById(_id: string) {
    try {
      const result = await Customers.findOne({ _id });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getCpf(cpf: string) {
    try {
      const result = await Customers.findOne({ cpf: cpf });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getCnpj(cnpj: string) {
    try {
      const result = await Customers.findOne({ cnpj: cnpj });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getPhone(phone: string) {
    try {
      const result = await Customers.findOne({ phone: phone });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getRg(rg: string) {
    try {
      const result = await Customers.findOne({ rg: rg });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getEmail(email: string) {
    try {
      const result = await Customers.findOne({ email: email });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
}
