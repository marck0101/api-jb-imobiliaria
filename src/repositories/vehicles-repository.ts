import { IVehicle } from '@/@types/vehicle';
import { UpdateWriteOpResult } from 'mongoose';

export interface GetVehiclesQuery {
  archivedAt?: {
    $exists: boolean;
  };
}

export interface VehiclesRepository {
  create(
    data: Omit<IVehicle, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>,
  ): Promise<IVehicle>;
  update(_id: string, data: Partial<IVehicle>): Promise<UpdateWriteOpResult>;
  archive(_id: string): Promise<UpdateWriteOpResult>;
  get(query?: GetVehiclesQuery): Promise<Array<IVehicle>>;
  getById(_id: string): Promise<IVehicle | null>;
}
