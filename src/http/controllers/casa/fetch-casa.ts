import { MongoCasaRepository } from '@/repositories/mongo/mongo-casa-repository';
import { FetchCasaUseCase } from '@/use-cases/vehicles/fetch-vehicles';
import { GetCasaUseCase } from '@/use-cases/vehicles/get-vehicle';
import { NextFunction, Request, Response } from 'express';

export async function fetchCasa(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const casaRepository = new MongoCasaRepository();
    // console.log('request.params.id', request.params);

    if (request.params.id) {
      const getCasaUseCase = new GetCasaUseCase(casaRepository);
      const data = await getCasaUseCase.execute(request.params.id);
      return response.status(200).json(data);
    }

    const fetchCasaUseCase = new FetchCasaUseCase(casaRepository);

    const data = await fetchCasaUseCase.execute();

    response.status(200).json({ data });
  } catch (e) {
    next(e);
  }
}
