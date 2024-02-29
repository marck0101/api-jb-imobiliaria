import { GetCepUseCase } from '@/use-cases/ceps/get-cep';
import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';


export async function getCep(request: Request, response: Response, next: NextFunction) {
    try {

        // if (!request.params.cep || request.params.cep.length != 8) {
        //     throw new ValidationError();
        // }

        const getCepUseCase = new GetCepUseCase();
        const { data, status } = await getCepUseCase.execute({ cep: request.params.cep });

        return response.status(status || 200).json(data);

    } catch (e) {
        next(e);
    }
}