import { IVehicle } from '@/@types/vehicle';
import { Vehicles } from '@/models/vehicle';
import { DatabaseError } from '@/utils';
import { GetVehiclesQuery, VehiclesRepository } from '../vehicles-repository';

export class MongoVehiclesRepository implements VehiclesRepository {
  async create(
    data: Omit<IVehicle, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>,
  ) {
    // console.log('data', data);
    try {
      const vehicle = new Vehicles(data);
      await vehicle.save();
      return vehicle;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }

  async update(_id: string, data: Partial<IVehicle>) {
    try {
      const result = await Vehicles.updateOne({ _id }, data);
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id: _id, ...data } });
    }
  }

  async archive(_id: string) {
    try {
      const result = await Vehicles.updateOne(
        { _id },
        { archivedAt: new Date() },
      );
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }

  async get(query: GetVehiclesQuery = {}) {
    try {
      const result = await Vehicles.find(query);
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getById(_id: string) {
    try {
      const result = await Vehicles.findOne({ _id });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
}
