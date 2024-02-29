import { AdminsRepository } from '@/repositories/admins-repository';
import { AuthenticationError, AuthorizationError, ResourceNotFoundError } from '@/utils';
import { generateToken } from '@/utils/generate-token';

import bcrypt from 'bcrypt';

interface Props {
    email: string;
    password: string;
}

export class CreateSessionUseCase {

    constructor(
        private adminsRepository: AdminsRepository,
    ) { }

    async execute({ email, password }: Props) {

        const admin = await this.adminsRepository.getByEmail(email);
        if (!admin) {
            throw new ResourceNotFoundError({ data: { email }, UIDescription: { 'pt-br': 'Esse e-mail não está vinculado a um usuário!' } });
        }

        if (admin.status != 'ACTIVE') {
            throw new AuthorizationError({ data: { ...admin }, 'UIDescription': { 'pt-br': 'Seu acesso foi bloqueado!' } });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            throw new AuthenticationError({ data: { ...admin }, 'UIDescription': { 'pt-br': 'Senha incorreta!' } });
        }

        const token = generateToken({ _id: admin._id });
        return {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: token,
        };
    }

}