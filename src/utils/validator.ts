
import { output, ZodError, ZodObject, ZodRawShape } from 'zod';
import { ValidationError } from './errors';
export class Validator<T extends ZodRawShape> {

    private schema: ZodObject<T>;

    constructor(schema: ZodObject<T>) {
        if (!schema) {
            throw new Error('schema must be provided in construct of Validator class');
        }
        this.schema = schema;
    }

    parse(data = {}): output<ZodObject<T>> {
        try {
            return this.schema.parse(data);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError({ data, details: error.errors });
        }
    }
}



