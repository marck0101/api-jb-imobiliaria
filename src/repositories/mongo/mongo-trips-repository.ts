import { ITrip, TripProps } from '@/@types/trips';
import { Trips } from '@/models/trip';
import { DatabaseError } from '@/utils';
import { ITripRepository, TripsRepository } from '../trips-repository';

interface GetProps {
  filter?: {
    archivedAt?: { $exists: boolean };
  };
  projection?: object;
  options?: object;
}

export class MongoTripsRepository implements TripsRepository {
  async create(data: TripProps) {
    try {
      const trip = new Trips(data);
      await trip.save();
      return trip;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }

  async update(
    query: ITripRepository.UpdateParams,
    data: Partial<Omit<ITrip, 'createdAt' | 'updatedAt' | '_id'>>,
  ) {
    try {
      await Trips.updateOne(query, data);
    } catch (e) {
      throw new DatabaseError({ data: { data, query } });
    }
  }

  async archive(_id: string) {
    try {
      // console.log('arquivando _id', _id);
      const result = await Trips.updateOne({ _id }, { archivedAt: new Date() });
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }

  async get(options: ITripRepository.GetParams = {}) {
    try {
      const limit = options.limit || 10;
      const skip = options.skip || 0;
      const filter = options.filter || {};

      // console.log('options', options);

      if (options) {
        filter.archivedAt = { $exists: false };

        const trips = await Trips.find(
          options.filter || {},
          options.projection || {},
        )
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip)
          .lean();
        return trips;
      } else {
        const result = await Trips.find(filter);
        return result;
      }
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async count(filter: ITripRepository.GetFilterParams) {
    try {
      const trips = await Trips.count(filter || {});
      return trips;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getById(_id: string) {
    try {
      const result = await Trips.findOne({ _id });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getVehicle(vehicle: string) {
    try {
      // console.log('mongo trips repository');
      const result = await Trips.find({
        vehicle,
        archivedAt: { $exists: false },
      });
      return result;
    } catch (error) {
      throw new DatabaseError();
    }
  }
}
