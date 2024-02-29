import { env } from '@/config/env';
import { MongoCteosRepository } from '@/repositories/mongo/mongo-cteos-repository';
import axios from 'axios';
import { UpdateCteosUseCase } from './update-cteos';

interface Props {
    ref: string;
    justificativa: string;
}

export class CancelCteosUseCase {

    async execute({ ref, justificativa }: Props) {

        console.log(`${env.FOCUS_NFE_BASE_URL}/cte/${ref}?token=${env.FOCUS_NFE_TOKEN}`, { justificativa: justificativa });

        const response = await axios.delete(`${env.FOCUS_NFE_BASE_URL}/cte/${ref}?token=${env.FOCUS_NFE_TOKEN}`, {
            data: { justificativa },
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        });

        if (response.status == 200) {
            const mongoCteosRepository = new MongoCteosRepository();
            const updateCteosUseCase = new UpdateCteosUseCase(mongoCteosRepository);
            await updateCteosUseCase.execute({ ref });
        }

        return response;
    }


}