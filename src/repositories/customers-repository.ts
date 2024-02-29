import { ICustomer } from '@/@types/customer';
import { UpdateWriteOpResult } from 'mongoose';

// export interface GetCustumersQuery {
export declare namespace ICustomerRepository {
  export interface UpdateParams {
    _id?: string;
    ref?: string;
  }

  export interface GetParams {
    archivedAt?: {
      $exists: boolean;
    };
    limit?: number;
    skip?: number;
    projection?: { [k: string]: boolean };
    filter?: GetFilterParams;
  }

  export interface GetFilterParams {
    createdAt?: { $gte: Date; $lte: Date };
  }
}

export interface CustomerRepository {
  create(
    data: Omit<ICustomer, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>,
  ): Promise<ICustomer>;
  update(
    params: ICustomerRepository.UpdateParams,
    data: Partial<Omit<ICustomer, 'createdAt' | 'updatedAt' | '_id'>>,
  ): Promise<void>;

  get(params?: ICustomerRepository.GetParams): Promise<Array<ICustomer>>;
  count(params?: ICustomerRepository.GetFilterParams): Promise<number>;

  archive(_id: string): Promise<UpdateWriteOpResult>;
  getById(_id: string): Promise<ICustomer | null>;
  getCpf(cpf: string): Promise<ICustomer | null>;
  getCnpj(cnpj: string): Promise<ICustomer | null>;
  getPhone(phone: string): Promise<ICustomer | null>;
  getRg(rg: string): Promise<ICustomer | null>;
  getEmail(email: string): Promise<ICustomer | null>;
}
