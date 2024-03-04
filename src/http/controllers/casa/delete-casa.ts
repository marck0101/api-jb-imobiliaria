import { MongoVehiclesRepository } from '@/repositories/mongo/mongo-vehicles-repository';
import { ArchiveVehicleUseCase } from '@/use-cases/vehicles/archive-vehicle';
import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';

export async function deleteVehicle(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.params.id) {
      throw new ValidationError();
    }

    const vehiclesRepository = new MongoVehiclesRepository();
    const archiveVehicleUseCase = new ArchiveVehicleUseCase(vehiclesRepository);

    await archiveVehicleUseCase.execute(request.params.id);

    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
