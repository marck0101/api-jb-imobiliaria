import { MongoAdminsRepository } from '@/repositories/mongo/mongo-admins-repository';
import { CreateSessionUseCase } from '@/use-cases/auth/create-session';
import { VerifySessionUseCase } from '@/use-cases/auth/verify-session';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty()
});

export async function createSession(request: Request, response: Response, next: NextFunction) {
    try {

        const adminsRepository = new MongoAdminsRepository();

        if (request.body.token) {
            const verifySessionUseCase = new VerifySessionUseCase(adminsRepository);
            const data = await verifySessionUseCase.execute({ token: request.body.token });
            return response.status(200).json(data);
        }

        const validator = new Validator(schema);
        validator.parse(request.body);

        const createSessionUseCase = new CreateSessionUseCase(adminsRepository);

        const data = await createSessionUseCase.execute(request.body);

        response.status(200).json(data);

    } catch (e) {
        next(e);
    }
}
