import { ICteos } from '@/@types/cteos';

export declare namespace ICteosRepository {
  export interface UpdateParams {
    _id?: string;
    ref?: string;
  }

  export interface GetParams {
    limit?: number;
    skip?: number;
    projection?: { [k: string]: boolean };
    filter?: GetFilterParams;
  }

  export interface GetFilterParams {
    createdAt?: { $gte: Date; $lte: Date };
  }
}

export interface CteosRepository {
  create(
    data: Omit<ICteos, 'createdAt' | 'updatedAt' | '_id'>,
  ): Promise<ICteos>;
  update(
    params: ICteosRepository.UpdateParams,
    data: Partial<Omit<ICteos, 'createdAt' | 'updatedAt' | '_id'>>,
  ): Promise<void>;

  get(params?: ICteosRepository.GetParams): Promise<Array<ICteos>>;

  count(params?: ICteosRepository.GetFilterParams): Promise<number>;
}
