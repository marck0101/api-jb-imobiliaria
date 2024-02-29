import { ITrip } from '@/@types/trips';
import { UpdateWriteOpResult } from 'mongoose';

export declare namespace ITripRepository {
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

export interface TripsRepository {
  create(
    data: Omit<ITrip, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>,
  ): Promise<ITrip>;
  archive(_id: string): Promise<UpdateWriteOpResult>;
  // update(_id: string, data: Partial<ITrip>): Promise<UpdateWriteOpResult>;
  // get(): Promise<Array<ITrip>>;

  update(
    params: ITripRepository.UpdateParams,
    data: Partial<Omit<ITrip, 'createdAt' | 'updatedAt' | '_id'>>,
  ): Promise<void>;
  get(params?: ITripRepository.GetParams): Promise<Array<ITrip>>;
  count(params?: ITripRepository.GetFilterParams): Promise<number>;

  getById(_id: string): Promise<ITrip | null>;
  getVehicle(vehicle: string): Promise<Array<ITrip>>;
}
