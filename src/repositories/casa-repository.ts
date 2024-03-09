import { ICasa } from '@/@types/casa';
import { UpdateWriteOpResult } from 'mongoose';

export interface GetCasaQuery {
  archivedAt?: {
    $exists: boolean;
  };
}

export interface CasaRepository {
  create(
    data: Omit<ICasa, 'createdAt' | '_id' | 'archivedAt' | 'updatedAt'>,
  ): Promise<ICasa>;
  update(_id: string, data: Partial<ICasa>): Promise<UpdateWriteOpResult>;
  archive(_id: string): Promise<UpdateWriteOpResult>;
  get(query?: GetCasaQuery): Promise<Array<ICasa>>;
  getById(_id: string): Promise<ICasa | null>;
}
