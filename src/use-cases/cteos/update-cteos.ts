import { env } from '@/config/env';
import { CteosRepository } from '@/repositories/cteos-repository';
import axios from 'axios';

interface Props {
    ref: string;
}

export class UpdateCteosUseCase {

    constructor(
        private repository: CteosRepository,
    ) { }

    async execute(data: Props) {

        const response = await axios.get(`${env.FOCUS_NFE_BASE_URL}/cte/${data.ref}?completa=1&token=${env.FOCUS_NFE_TOKEN}`);
        await this.repository.update({ ref: data.ref }, { ...(response.data) });

    }

}






