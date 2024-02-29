import { env } from '@/config/env';
import axios from 'axios';

interface Props {
    cep: string;
}

export class GetCepUseCase {

    async execute({ cep }: Props) {
        const url = `${env.FOCUS_NFE_BASE_URL}/ceps/${cep}?token=${env.FOCUS_NFE_TOKEN}`;
        const { data, status } = await axios.get(url, { validateStatus: () => true });
        return { data, status };
    }

}