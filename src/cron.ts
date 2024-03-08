import cluster from 'cluster';
import cron from 'node-cron';
import { Cteos } from './models/cteos';
import { MongoCteosRepository } from './repositories/mongo/mongo-cteos-repository';
import { UpdateCteosUseCase } from './use-cases/cteos/update-cteos';

if (cluster.isPrimary) {
  setTimeout(() => {
    console.log('✅ Cron is running!');

    cron.schedule('0 0 * * *', async () => {
      const cteos = await Cteos.find({}, { ref: true });

      const cteosRepository = new MongoCteosRepository();
      const updateCteosUseCase = new UpdateCteosUseCase(cteosRepository);

      for (const c of cteos) {
        await new Promise((r) => setTimeout(r, 1000));
        try {
          await updateCteosUseCase.execute({ ref: c.ref });
        } catch (e) {}
      }
    });

    cron.schedule('0 8,12,16,20 * * *', async () => {
      const cteos = await Cteos.find(
        { $or: [{ status: 'processando_autorizacao' }] },
        { ref: true },
      );

      const cteosRepository = new MongoCteosRepository();
      const updateCteosUseCase = new UpdateCteosUseCase(cteosRepository);

      for (const c of cteos) {
        await new Promise((r) => setTimeout(r, 1000));
        try {
          await updateCteosUseCase.execute({ ref: c.ref });
        } catch (e) {}
      }
    });
  }, 5000);
}
