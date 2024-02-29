import { GetCfopUseCase } from '@/use-cases/cfops/get-cfop';
import { NextFunction, Request, Response } from 'express';

export async function getCfop(request: Request, response: Response, next: NextFunction) {
    try {

        const getCfopUseCase = new GetCfopUseCase();
        const { data, status } = await getCfopUseCase.execute({ cfop: request.params.cfop });

        return response.status(status || 200).json(data);

    } catch (e) {
        next(e);
    }
}