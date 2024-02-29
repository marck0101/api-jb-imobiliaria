import { AdminsRepository } from '../admins-repository';

import { Admins } from '@/models/admin';
import { DatabaseError } from '@/utils';

export class MongoAdminsRepository implements AdminsRepository {

  async getByEmail(email: string) {
    try {
      const admin = await Admins.findOne({ email });
      return admin;


    } catch (e) {
      throw new DatabaseError({ data: { email } });
    }
  }

  async getById(_id: string) {
    try {
      const admin = await Admins.findOne({ _id });
      return admin;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }

}



