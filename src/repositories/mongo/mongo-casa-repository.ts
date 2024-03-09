import { DatabaseError } from '@/utils';
import { ICasaRepository } from '../casa-repository';
import { ICasa } from '@/@types/casa';
import { Casa } from '@/models/casa';

export class MongoCasaRepository implements ICasaRepository {
  async create(
    data: Omit<ICasa, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>,
  ) {
    // console.log('data', data);
    try {
      const casa = new Casa(data);
      await casa.save();
      return casa;
    } catch (e) {
      console.log('e==>', e);
      throw new DatabaseError({ data });
    }
  }

  async get(options: ICasaRepository.GetParams = {}) {
    try {
      const limit = options.limit || 10;
      const skip = options.skip || 0;
      const filter = options.filter || {};

      // console.log('options', options);

      if (options) {
        filter.archivedAt = { $exists: false };

        const trips = await Casa.find(
          options.filter || {},
          options.projection || {},
        )
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip)
          .lean();
        return trips;
      } else {
        const result = await Casa.find(filter);
        return result;
      }
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getById(_id: string) {
    try {
      const result = await Casa.findOne({ _id });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async archive(_id: string) {
    try {
      // console.log('arquivando _id', _id);
      const result = await Casa.updateOne({ _id }, { archivedAt: new Date() });
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }

  async update(
    query: ICasaRepository.UpdateParams,
    data: Partial<Omit<ICasa, 'createdAt' | 'updatedAt' | '_id'>>,
  ) {
    try {
      await Casa.updateOne(query, data);
    } catch (e) {
      throw new DatabaseError({ data: { data, query } });
    }
  }
}
