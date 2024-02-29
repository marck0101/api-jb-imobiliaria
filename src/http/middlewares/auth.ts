import { Request, Response, NextFunction } from 'express';
import errorHandling from './error-handling';

import { VerifySessionUseCase } from '@/use-cases/auth/verify-session';
import { MongoAdminsRepository } from '@/repositories/mongo/mongo-admins-repository';
export interface IDecodeParams {
    id?: string | undefined;
    iat?: number | undefined;
}

export default async (request: Request, response: Response, next: NextFunction) => {
    try {

        const adminsRepository = new MongoAdminsRepository();
        const verifySessionUseCase = new VerifySessionUseCase(adminsRepository);

        await verifySessionUseCase.execute({ token: request.headers.token as string });

        next();

    } catch (e) {
        errorHandling(e as Error, request, response, next);
    }
};