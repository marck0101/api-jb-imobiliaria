import { ITrip } from '@/@types/trips';
import { GetTripUseCase } from '@/use-cases/trips/get-trip';
import { MongoTripsRepository } from '@/repositories/mongo/mongo-trips-repository';
import { UpdateTripUseCase } from '@/use-cases/trips/update-trip';
import { ValidationError } from '@/utils';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { Mixed } from 'mongoose';
import { z } from 'zod';

const addressSchema = z.object({
  postalCode: z.string().optional(),
  city: z.string().min(1),
  number: z.string().optional(),
  state: z.string().min(1),
  street: z.string().optional(),
  country: z.string().optional(),
});

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),

  startAddress: addressSchema.optional(),
  endAddress: addressSchema.optional(),

  startDate: z.string().optional(),
  endDate: z.string().optional(),

  type: z.enum(['SCHEDULED', 'CHARTER', 'UNIVERSITY']).optional(),

  vehicle: z.custom<Mixed>().optional(),
  passengers: z
    .array(
      z
        .object({
          customer: z.string().optional(),
          seat: z.string().optional(),
        })
        .optional(),
    )
    .optional(),
});

export async function updateTrip(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.params.id) {
      throw new ValidationError({
        description: { en: 'Trip _id must be provided' },
      });
    }

    const validator = new Validator(schema);
    // console.log('request.body update', request.body);
    validator.parse(request.body);

    const tripsRepository = new MongoTripsRepository();
    const updateTripUseCase = new UpdateTripUseCase(tripsRepository);
    const getTripUseCase = new GetTripUseCase(tripsRepository);

    if (!request.query.deletepassengers) {
      const trip: ITrip | null = await getTripUseCase.execute(
        request.params.id,
      );
    }

    await updateTripUseCase.execute(request.params.id, {
      ...request.body,
      startDate: new Date(request.body.startDate),
      endDate: new Date(request.body.endDate),
    });

    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
