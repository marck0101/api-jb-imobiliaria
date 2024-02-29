import { DefaultError, ErrorDescription, UnknownError } from '@/utils';
import { NextFunction, Request, Response } from 'express';

interface MessageProps {
    error: string;
    status: number;
    message?: string;
    UIDescription?: string;
    details?: Array<object | string>;
}

export default async (e: Error, request: Request, response: Response, next: NextFunction) => { // eslint-disable-line 

    const error = e instanceof DefaultError ? e : new UnknownError(e instanceof Error ? { path: e.stack } : {});

    const message: MessageProps = {
        error: error.message, status: error.status
    };

    if (error.description['en']) {
        message.message = error.description['en'];
    }

    if (error?.details?.length) {
        message.details = error.details;
    }

    if (request.get('ui-description')) {

        const LANGUAGES = ['en', 'pt-br'];

        if (LANGUAGES.includes(String(request.headers['ui-language']))) {
            message.UIDescription = error.UIDescription[String(request.headers['ui-language']) as keyof ErrorDescription];
        }
    }

    return response.status(error.status || 400).json(message);
};





