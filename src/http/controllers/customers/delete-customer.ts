import { MongoCustumerRepository } from '@/repositories/mongo/mongo-customers-repository';
import { ArchiveCustomerUseCase } from '@/use-cases/customers/archive-customers';
import { GetCustomersUseCase } from '@/use-cases/customers/get-customers';
import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from './firebase';

export async function deleteCustomer(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    // console.log('request.params.id', request.params.id);

    if (!request.params.id) {
      throw new ValidationError();
    }

    const customerRepository = new MongoCustumerRepository();
    const archiveCustomerUseCase = new ArchiveCustomerUseCase(
      customerRepository,
    );
    const getCustomerUseCase = new GetCustomersUseCase(customerRepository);

    await archiveCustomerUseCase.execute(request.params.id);
    const customer = await getCustomerUseCase.execute(request.params.id);

    customer.files.forEach(async (item) => {
      if (item.url) {
        try {
          // Obtém a referência para o arquivo usando a URL
          const storageRef = ref(storage, item.url);
          // Deleta o arquivo do Firebase Storage
          await deleteObject(storageRef);
          // Limpa o estado da URL da imagem
        } catch (error) {
          console.error('Erro ao deletar arquivo:', error);
        }
      } else {
        console.log('Nenhuma imagem para deletar.');
      }
    });

    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
