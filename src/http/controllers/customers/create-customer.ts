import { MongoCustumerRepository } from '@/repositories/mongo/mongo-customers-repository';
import { CreateCustomerUseCase } from '@/use-cases/customers/create-customers';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const schema = z.object({
  name: z.string().nonempty(),
  fantasyname: z.string().optional(),
  email: z.string().optional(),
  birthdate: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  rg: z.string().optional(),

  takerIndicator: z.string().optional(),
  borrowerRegistration: z.string().optional(),

  address: z
    .object({
      cep: z.string().optional(),
      city: z.string().optional(),
      number: z.string().optional(),
      state: z.string().optional(),
      street: z.string().optional(),
      bairro: z.string().optional(),
    })
    .optional(),

  files: z
    .array(
      z.object({
        name: z.string().optional(),
        url: z.string().optional(),
        size: z.number().optional(),
        type: z.string().optional(),
      }),
    )
    .optional(),
});

export async function createCustomer(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const validator = new Validator(schema);
    // console.log('controller', request.body);

    validator.parse(request.body);

    const customersRepository = new MongoCustumerRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(
      customersRepository,
    );

    const data = await createCustomerUseCase.execute(request.body);
    response.status(200).json(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
}
