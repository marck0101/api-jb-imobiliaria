import { MongoVehiclesRepository } from '@/repositories/mongo/mongo-vehicles-repository';
import { UpdateVehicleUseCase } from '@/use-cases/vehicles/update-vehicle';
import { ValidationError } from '@/utils';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['1', '2']).optional(),
  taf: z.string().optional(),
  renavam: z.string().optional(),
  licensePlate: z.string().optional(),
  uf: z.string().optional(),

  color: z.string().optional(),

  owner: z.object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    corporateName: z.string().optional(),
    ie: z.string().optional(),
    uf: z.string().optional(),
    type: z.enum(['0', '1', '2']).optional(),
    taf: z.string().optional(),
  }),
  nre: z.string().optional(),
  name: z.string().optional(),
  manufacturingYear: z.number().min(1950).optional(),
  modelYear: z.number().min(1950).optional(),
  mmv: z.string().optional(),
});

export async function updateVehicle(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.params.id) {
      throw new ValidationError();
    }
    // console.log('update request.body', request.body);

    const validator = new Validator(schema);
    validator.parse(request.body);

    const vehiclesRepository = new MongoVehiclesRepository();
    const updateVehicleUseCase = new UpdateVehicleUseCase(vehiclesRepository);

    await updateVehicleUseCase.execute(request.params.id, request.body);

    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
