import { MongoTripsRepository } from '@/repositories/mongo/mongo-trips-repository';
import { ArchiveTripUseCase } from '@/use-cases/trips/archive-trip';
import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';

export async function deleteTrip(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // console.log('request.params.id', request.params.id);
  try {
    if (!request.params.id) {
      throw new ValidationError({
        description: { en: 'Trip _id must be provided' },
      });
    }

    const tripsRepository = new MongoTripsRepository();
    const archiveTripUseCase = new ArchiveTripUseCase(tripsRepository);

    // Adicione um log para verificar se o ID está correto
    // console.log(`Excluindo viagem com ID: ${request.params.id}`);

    // Executa a exclusão
    await archiveTripUseCase.execute(request.params.id);

    // Adicione um log para indicar que a exclusão foi bem-sucedida
    // console.log(`Viagem com ID ${request.params.id} excluída com sucesso.`);

    // Retorna a resposta
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    // Se houver um erro, envie para o próximo middleware
    next(e);
  }
}

// import { MongoTripsRepository } from '@/repositories/mongo/mongo-trips-repository';
// import { ArchiveTripUseCase } from '@/use-cases/trips/archive-trip';
// import { ValidationError } from '@/utils';
// import { NextFunction, Request, Response } from 'express';

// export async function deleteTrip(
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ) {
//   try {
//     if (!request.params.id) {
//       throw new ValidationError({
//         description: { en: 'Trip _id must be provided' },
//       });
//     }

//     const tripsRepository = new MongoTripsRepository();
//     const archiveTripUseCase = new ArchiveTripUseCase(tripsRepository);

//     await archiveTripUseCase.execute(request.params.id);
//     response.status(200).json({ _id: request.params.id });
//   } catch (e) {
//     next(e);
//   }
// }
