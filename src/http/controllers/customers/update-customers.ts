import { MongoCustumerRepository } from '@/repositories/mongo/mongo-customers-repository';
import { GetCustomersUseCase } from '@/use-cases/customers/get-customers';
import { UpdateCustomersUseCase } from '@/use-cases/customers/update-customers';
import { ValidationError } from '@/utils';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const schema = z.object({
  name: z.string().optional(),
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
      bairro: z.string().optional(),
      state: z.string().optional(),
      street: z.string().optional(),
    })
    .optional(),
  files: z.array(
    z
      .object({
        name: z.string().optional(),
        url: z.string().optional(),
        size: z.number().optional(),
        type: z.string().optional(),
      })
      .optional(),
  ),
});

export async function updateCustomer(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    // console.log('Update', request.params.id);

    if (!request.params.id) {
      throw new ValidationError();
    }

    const validator = new Validator(schema);
    validator.parse(request.body);

    // console.log('request.body', request.body);

    const customersRepository = new MongoCustumerRepository();
    const updateCustomersUseCase = new UpdateCustomersUseCase(
      customersRepository,
    );
    const getCustomerUseCase = new GetCustomersUseCase(customersRepository);

    if (!request.query.deleteFiles) {
      const customer = await getCustomerUseCase.execute(request.params.id);
      if (request.body.files) {
        request.body.files = [...customer.files, ...request.body.files];
      }
    }
    await updateCustomersUseCase.execute(request.params.id, request.body);

    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
