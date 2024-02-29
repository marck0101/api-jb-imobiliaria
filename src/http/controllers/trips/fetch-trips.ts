import { ITrip } from '@/@types/trips';
import { MongoTripsRepository } from '@/repositories/mongo/mongo-trips-repository';
import { FetchTripsUseCase } from '@/use-cases/trips/fetch-trips';
import { GetTripUseCase } from '@/use-cases/trips/get-trip';
import { NextFunction, Request, Response } from 'express';

import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

interface FilterProps {
  vehicles: { $in: Array<string> };
  types: { $in: Array<string> };
}

export async function fetchTrips(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const tripsRepository = new MongoTripsRepository();

    // const { query } = request;
    const query = { ...request.query };

    const filter = {} as FilterQuery<ITrip>;
    const projection = {} as ProjectionType<ITrip>;
    const options = {} as QueryOptions<ITrip>;

    if (request.params.id) {
      const getTripUseCase = new GetTripUseCase(tripsRepository);
      const data = await getTripUseCase.execute(request.params.id);
      // console.log('data', data);
      // console.log('request.params.id', request.params.id);
      return response.status(200).json(data);
    }

    if (query.vehicles && typeof query.vehicles == 'string') {
      const vehicles = query.vehicles.split(',');

      if (vehicles.length == 1) {
        filter.vehicle = vehicles[0];
      } else {
        filter.vehicle = { $in: vehicles };
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

    const fetchTripsUseCase = new FetchTripsUseCase(tripsRepository);

    // const data = await fetchTripsUseCase.execute({ filter, projection, options });
    // console.log('filter=>', filter);
    const { data, count } = await fetchTripsUseCase.execute({
      filter: filter,
    });

    response.status(200).json({ data, count });
  } catch (e) {
    next(e);
  }
}
