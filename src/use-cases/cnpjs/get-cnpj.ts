import { env } from '@/config/env';
import axios from 'axios';

interface Props {
    cnpj: string;
}

export class GetCnpjUseCase {

    async execute({ cnpj }: Props) {
        // const url = `${env.FOCUS_NFE_BASE_URL}/cnpjs/${cnpj}?token=${env.FOCUS_NFE_TOKEN}`;
        const url = ` https://3S6IOjm4PAM4Tpvf8Typcva4IjxZieTB@api.focusnfe.com.br/v2/cnpjs/${cnpj}`;
        const { data, status } = await axios.get(url, { validateStatus: () => true });
        return { data, status };
    }

}