import { IAdmin } from '@/@types/admin';

export interface AdminsRepository {
    getByEmail(email: string): Promise<IAdmin | null>;
    getById(_id: string): Promise<IAdmin | null>;
}