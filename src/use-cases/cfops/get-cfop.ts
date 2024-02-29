import { env } from '@/config/env';
import axios from 'axios';

interface Props {
    cfop: string;
}

export class GetCfopUseCase {

    async execute({ cfop }: Props) {
        const url = `${env.FOCUS_NFE_BASE_URL}/cfops/${cfop}?token=${env.FOCUS_NFE_TOKEN}`;
        const { data, status } = await axios.get(url, { validateStatus: () => true });
        return { data, status };
    }

}