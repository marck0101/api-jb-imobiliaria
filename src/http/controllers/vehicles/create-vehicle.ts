import { MongoVehiclesRepository } from '@/repositories/mongo/mongo-vehicles-repository';
import { CreateVehicleUseCase } from '@/use-cases/vehicles/create-vehicle';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['1', '2']),
  nre: z.string().nonempty(),
  renavam: z.string().nonempty(),
  licensePlate: z.string().nonempty(),
  uf: z.string().nonempty(),

  name: z.string().nonempty(),
  manufacturingYear: z.number().min(1950),
  modelYear: z.number().min(1950),
  //marca - modelo - versão
  mmv: z.string().nonempty(),
  taf: z.string().optional(),

  color: z.string().optional(),

  owner: z.object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    corporateName: z.string().nonempty(),
    ie: z.string().nonempty(),
    uf: z.string().nonempty(),
    type: z.enum(['0', '1', '2']),
    taf: z.string().nonempty(),
  }),
});

export async function createVehicle(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    // console.log('request.body', request.body);

    const validator = new Validator(schema);
    validator.parse(request.body);

    const vehiclesRepository = new MongoVehiclesRepository();
    const createVehicleUseCase = new CreateVehicleUseCase(vehiclesRepository);

    const data = await createVehicleUseCase.execute(request.body);

    response.status(200).json(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
}
