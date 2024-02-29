import { MongoTripsRepository } from '@/repositories/mongo/mongo-trips-repository';
import { CreateTripUseCase } from '@/use-cases/trips/create-trip';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const addressSchema = z
  .object({
    postalCode: z.string().optional(),
    city: z.string().min(1).optional(),
    number: z.string().optional(),
    state: z.string().min(1).optional(),
    street: z.string().optional(),
    country: z.string().min(1).optional(),
  })
  .optional();

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),

  startAddress: addressSchema,
  endAddress: addressSchema,

  startDate: z.string(), // Aceita datas no formato ISO 8601
  endDate: z.string(),

  type: z.enum(['SCHEDULED', 'CHARTER', 'UNIVERSITY']),
  vehicle: z.string().min(1),

  passengers: z
    .array(
      z
        .object({
          seat: z.string().optional(),
          customer: z.string().optional(),
        })
        .optional(),
    )
    .optional(),
});

export async function createTrip(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const validator = new Validator(schema);
    // console.log('request.body', request.body);
    // console.log('trip', trip);
    validator.parse(request.body);

    const tripsRepository = new MongoTripsRepository();
    const createTripUseCase = new CreateTripUseCase(tripsRepository);

    // Modifique para converter as datas para o tipo Date
    const data = await createTripUseCase.execute({
      ...request.body,
      startDate: new Date(request.body.startDate),
      endDate: new Date(request.body.endDate),
    });

    response.status(201).json(data);
  } catch (e) {
    next(e);
  }
}
