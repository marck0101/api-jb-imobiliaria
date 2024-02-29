import { MongoCustumerRepository } from '@/repositories/mongo/mongo-customers-repository';
import { FetchCustumersUseCase } from '@/use-cases/customers/fetch-customers';
import { GetCustomersUseCase } from '@/use-cases/customers/get-customers';
import { NextFunction, Request, Response } from 'express';

export async function fetchCustomers(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const customersRepository = new MongoCustumerRepository();

    const query = { ...request.query };
    if (request.params.id) {
      const getCustomersUseCase = new GetCustomersUseCase(customersRepository);
      const data = await getCustomersUseCase.execute(request.params.id);
      return response.status(200).json(data);
    }

    const fetchCustumersUseCase = new FetchCustumersUseCase(
      customersRepository,
    );

    const { data, count } = await fetchCustumersUseCase.execute(
      query as { [k: string]: string },
    );
    // console.log('query=>', query);

    response.status(200).json({ data, count });
  } catch (e) {
    next(e);
  }
}
