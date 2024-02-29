import { GetCnpjUseCase } from '@/use-cases/cnpjs/get-cnpj';
import { NextFunction, Request, Response } from 'express';

export async function getCnpj(request: Request, response: Response, next: NextFunction) {
    try {

        const getCnpjUseCase = new GetCnpjUseCase();
        const { data, status } = await getCnpjUseCase.execute({ cnpj: request.params.cnpj });

        return response.status(status || 200).json(data);

    } catch (e) {
        next(e);
    }
}