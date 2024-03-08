import { Admins } from './models/admin';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { env } from './config/env';

import cluster from 'cluster';
import { Cteos } from './models/cteos';
import { UpdateCteosUseCase } from './use-cases/cteos/update-cteos';
import { MongoCteosRepository } from './repositories/mongo/mongo-cteos-repository';

if (cluster.isPrimary) {
  (async () => {
    // const { data } = await axios.post(`${env.FOCUS_NFE_BASE_URL}/hooks?token=${env.FOCUS_NFE_TOKEN}`, {
    //     event: 'cte',
    //     url: env.API_URL + '/cteos/webhooks',
    // }, { validateStatus: () => true });
    // if (data.id) {
    //     console.log('✅ Webhook criado com sucesso!');
    // }
  })();
  (async () => {
    const admin = await Admins.findOne({ email: 'admin@gmail.com' });
    if (admin) return;

    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash('123456', salt);

    await new Admins({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: password,
    }).save();
  })();
}
