import { MongoVehiclesRepository } from '@/repositories/mongo/mongo-vehicles-repository';
import { FetchVehiclesUseCase } from '@/use-cases/vehicles/fetch-vehicles';
import { GetVehicleUseCase } from '@/use-cases/vehicles/get-vehicle';
import { NextFunction, Request, Response } from 'express';

export async function fetchVehicles(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const vehiclesRepository = new MongoVehiclesRepository();
    // console.log('request.params.id', request.params);

    if (request.params.id) {
      const getVehicleUseCase = new GetVehicleUseCase(vehiclesRepository);
      const data = await getVehicleUseCase.execute(request.params.id);
      return response.status(200).json(data);
    }

    const fetchVehiclesUseCase = new FetchVehiclesUseCase(vehiclesRepository);

    const data = await fetchVehiclesUseCase.execute();

    response.status(200).json({ data });
  } catch (e) {
    next(e);
  }
}
