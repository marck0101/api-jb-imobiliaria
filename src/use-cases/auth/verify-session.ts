import { AdminsRepository } from '@/repositories/admins-repository';
import { ResourceNotFoundError } from '@/utils';
import { generateToken } from '@/utils/generate-token';
import { decodeToken } from '@/utils/decode-token';

import { AuthenticationError } from '@/utils';

interface Props {
    token: string;
}

interface IDecodeParams {
    _id?: string;
}

export class VerifySessionUseCase {

    constructor(
        private adminsRepository: AdminsRepository,
    ) { }

    async execute({ token }: Props) {

        if (!token) {
            throw new AuthenticationError();
        }

        const decode = decodeToken(token) as IDecodeParams;
        if (!decode._id) {
            throw new AuthenticationError({ data: { token }, 'UIDescription': { 'pt-br': 'Seu acesso expirou, faça login novamente!' } });
        }

        const admin = await this.adminsRepository.getById(decode._id);
        if (!admin) {
            throw new ResourceNotFoundError({ data: { _id: decode._id }, UIDescription: { 'pt-br': 'Seu usuário não foi encontrado!' } });
        }

        if (admin.status != 'ACTIVE') {
            throw new AuthenticationError({ data: { ...admin }, 'UIDescription': { 'pt-br': 'Seu acesso foi bloqueado!' } });
        }

        return {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken({ _id: admin._id }),
        };
    }

}