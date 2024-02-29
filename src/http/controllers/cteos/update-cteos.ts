import { MongoCteosRepository } from '@/repositories/mongo/mongo-cteos-repository';
import { UpdateCteosUseCase } from '@/use-cases/cteos/update-cteos';
import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';

export async function updateCteos(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    console.log('✅ Recebeu um webhook!');

    if (!request.body.ref) {
      throw new ValidationError();
    }

    const cteosRepository = new MongoCteosRepository();

    const updateCteosUseCase = new UpdateCteosUseCase(cteosRepository);
    await updateCteosUseCase.execute({ ref: request.params.ref });

    response.status(200).json({ ok: true });
  } catch (e) {
    next(e);
  }
}
