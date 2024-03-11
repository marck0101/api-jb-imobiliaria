import { ICasa } from '@/@types/casa';
import { UpdateWriteOpResult } from 'mongoose';

// export interface GetCasaQuery {
//   archivedAt?: {
//     $exists: boolean;
//   };
// }

export declare namespace ICasaRepository {
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
    archivedAt?: {
      $exists: boolean;
    };
  }

  export interface GetCasaQuery {
    archivedAt?: {
      $exists: boolean;
    };
  }
}

export interface CasaRepository {
  create(
    data: Omit<ICasa, 'createdAt' | '_id' | 'archivedAt' | 'updatedAt'>,
  ): Promise<ICasa>;
  // update(_id: string, data: Partial<ICasa>): Promise<UpdateWriteOpResult>;
  // archive(_id: string): Promise<UpdateWriteOpResult>;
  get(query?: ICasaRepository.GetCasaQuery): Promise<Array<ICasa>>;
  // count(params?: ICasaRepository.GetFilterParams): Promise<number>;

  // getById(_id: string): Promise<ICasa | null>;

  // getCasa(casa: string): Promise<Array<ICasa>>;
}
