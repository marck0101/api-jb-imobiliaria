import { CancelCteosUseCase } from '@/use-cases/cteos/cancel-cteos';
import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';


export async function deleteCteos(request: Request, response: Response, next: NextFunction) {
    try {

        if (!request.params.id || !request.query.justificativa) {
            throw new ValidationError();
        }

        const cancelCteosUseCase = new CancelCteosUseCase();
        const { status, data } = await cancelCteosUseCase.execute({ ref: request.params.id, justificativa: request.query.justificativa as string });

        response.status(status || 200).json(data);

    } catch (e) {
        next(e);
    }
}