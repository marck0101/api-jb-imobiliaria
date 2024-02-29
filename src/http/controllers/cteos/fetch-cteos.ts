import { MongoCteosRepository } from '@/repositories/mongo/mongo-cteos-repository';
import { FetchCteosUseCase } from '@/use-cases/cteos/fetch-cteos';
import { NextFunction, Request, Response } from 'express';

export async function fetchCteos(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const repository = new MongoCteosRepository();

    const query = { ...request.query };

    query.filter = {};

    if (query.status) {
      query.filter.status = query.status;
      delete query.status;
    }

    if (query.name) {
      query.filter.name = { $regex: query.name };
      delete query.name;
    }

    if (query.since && query.to) {
      query.filter.createdAt = { $gte: query.since, $lte: query.to };
      delete query.since;
      delete query.to;
    }

    const fetchCteosUseCase = new FetchCteosUseCase(repository);
    const { data, count } = await fetchCteosUseCase.execute(
      query as { [k: string]: string },
    );

    response.status(200).json({ data, count });
  } catch (e) {
    next(e);
  }
}
