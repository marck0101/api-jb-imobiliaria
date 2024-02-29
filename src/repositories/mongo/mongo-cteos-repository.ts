import { ICteos } from '@/@types/cteos';
import { Cteos } from '@/models/cteos';
import { DatabaseError } from '@/utils';
import { CteosRepository, ICteosRepository } from '../cteos-repository';

export class MongoCteosRepository implements CteosRepository {
  async create(data: Omit<ICteos, 'createdAt' | 'updatedAt' | '_id'>) {
    try {
      const cteos = new Cteos(data);
      await cteos.save();
      return cteos;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }

  async get(options: ICteosRepository.GetParams = {}) {
    try {
      const limit = options.limit || 10;
      const skip = options.skip || 0;

      const cteos = await Cteos.find(
        options.filter || {},
        options.projection || {},
      )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
      return cteos;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async count(filter: ICteosRepository.GetFilterParams) {
    try {
      const cteos = await Cteos.count(filter || {});
      return cteos;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async update(
    query: ICteosRepository.UpdateParams,
    data: Partial<Omit<ICteos, 'createdAt' | 'updatedAt' | '_id'>>,
  ) {
    try {
      await Cteos.updateOne(query, data);
    } catch (e) {
      throw new DatabaseError({ data: { data, query } });
    }
  }
}
