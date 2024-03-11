import { ICasa } from '@/@types/casa';
import { MongoCasaRepository } from '@/repositories/mongo/mongo-casa-repository';
import { NextFunction, Request, Response } from 'express';

import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { FetchCasaUseCase } from '@/use-cases/vehicles/fetch-vehicles';
import { GetCasaUseCase } from '@/use-cases/vehicles/get-vehicle';

interface FilterProps {
  casa: { $in: Array<string> };
  types: { $in: Array<string> };
}

export async function fetchCasa(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const casaRepository = new MongoCasaRepository();

    // const { query } = request;
    const query = { ...request.query };

    const filter = {} as FilterQuery<ICasa>;
    const projection = {} as ProjectionType<ICasa>;
    const options = {} as QueryOptions<ICasa>;

    if (request.params.id) {
      const getCasaUseCase = new GetCasaUseCase(casaRepository);
      const data = await getCasaUseCase.execute(request.params.id);
      // console.log('data', data);
      // console.log('request.params.id', request.params.id);
      return response.status(200).json(data);
    }

    if (query.casa && typeof query.casa == 'string') {
      const casa = query.casa.split(',');

      if (casa.length == 1) {
        filter.vehicle = casa[0];
      } else {
        filter.vehicle = { $in: casa };
      }
    }

    if (query.types && typeof query.types == 'string') {
      const types = query.types.split(',');

      if (types.length == 1) {
        filter.type = types[0];
      } else {
        filter.type = { $in: types };
      }
    }

    const fetchCasaUseCase = new FetchCasaUseCase(casaRepository);

    // const data = await fetchTripsUseCase.execute({ filter, projection, options });
    // console.log('filter=>', filter);
    const { data, count } = await fetchCasaUseCase.execute({
      filter: filter,
    });

    response.status(200).json({ data, count });
  } catch (e) {
    next(e);
  }
}
