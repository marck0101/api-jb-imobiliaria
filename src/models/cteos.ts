import { ICteos } from '@/@types/cteos';
import { model, Schema } from 'mongoose';

export const schema = new Schema<ICteos>({

    cnpj_emitente: String,
    ref: String,

    status: String,
    status_sefaz: String,
    chave: String,
    numero: String,
    serie: String,
    modelo: String,
    caminho_xml: String,
    caminho_dacte: String,

    mensagem_sefaz: String,
    caminho_xml_carta_correcao: String,
    requisicao: Object,
    protocolo: Object,

    requisicao_carta_correcao: Object,
    protocolo_carta_correcao: Object

}, { timestamps: true });

export const Cteos = model('Cteos', schema);

