import { IFocusNFeCteos } from '@/@types/focus-nfe-cteos';
import { env } from '@/config/env';
import { CteosRepository } from '@/repositories/cteos-repository';
import { VehiclesRepository } from '@/repositories/vehicles-repository';
import axios from 'axios';

import { randomUUID } from 'crypto';
import { GetVehicleUseCase } from '../vehicles/get-vehicle';

const DEFAULT = {
  bairro_emitente: 'Bela União',
  cep_emitente: '98900000',
  cnpj_emitente: '05435582000152',
  codigo_municipio_emitente: '4317202',
  codigo_municipio_envio: '4317202',
  inscricao_estadual_emitente: '1100090700',
  codigo_pais_tomador: '1058',
  pais_tomador: 'Brasil',

  icms_aliquota: '0.00',
  icms_base_calculo: '0.00',
  icms_situacao_tributaria: '90_simples_nacional',
  icms_indicador_simples_nacional: 1,

  icms_valor: '0.00',
  logradouro_emitente: 'Rua Bela União',
  modal: '01',

  municipio_emitente: 'Santa Rosa',
  municipio_envio: 'Santa Rosa',

  nome_emitente: 'VDR PETRI TURISMO LTDA',
  nome_fantasia_emitente: 'VDR PETRI TURISMO LTDA',

  numero_emitente: '1136',

  quantidade: '1.00',
  telefone_emitente: '5535116020',
  tipo_documento: 0,
  uf_emitente: 'RS',
  uf_envio: 'RS',

  valor_desconto_fatura: '0.00',
  valor_liquido_fatura: '1.00',
  valor_original_fatura: '1.00',
  valor_total_tributos: '0.00',

  valor_pis: '0.00',
  valor_cofins: '0.00',
};

interface Props {
  bairro_tomador: string;
  cep_tomador: string;
  cfop: string;
  cnpj_tomador: string;
  codigo_municipio_fim: string;
  codigo_municipio_inicio: string;
  codigo_municipio_tomador: string;
  codigo_pais_tomador: string;
  data_emissao: string;
  descricao_servico: string;
  indicador_inscricao_estadual_tomador: string;
  inscricao_estadual_tomador?: string;
  logradouro_tomador: string;
  municipio_fim: string;
  municipio_inicio: string;
  municipio_tomador: string;
  natureza_operacao: string;
  nome_fantasia_tomador: string;
  nome_tomador: string;
  numero_fatura: string;
  numero_tomador: string;
  pais_tomador: string;
  tipo_servico: number;
  uf_fim: string;
  uf_inicio: string;
  uf_tomador: string;
  valor_receber: string;
  valor_total: string;
  modal_rodoviario: string;
}

export class CreateCteosUseCase {
  constructor(
    private vehiclesRepository: VehiclesRepository,
    private cteosRepository: CteosRepository,
  ) {}

  async execute(data: Props) {
    const getVehicleUseCase = new GetVehicleUseCase(this.vehiclesRepository);
    const vehicle = await getVehicleUseCase.execute(data.modal_rodoviario);

    const request: IFocusNFeCteos = {
      ...data,
      ...DEFAULT,
      data_emissao: new Date().toISOString(),
      numero_fatura: randomUUID(),
      modal_rodoviario: {
        numero_registro_estadual: vehicle.nre,
        taf_proprietario: vehicle.owner.taf,
        razao_social_proprietario: vehicle.owner.corporateName,
        placa: vehicle.licensePlate,
        renavam: vehicle.renavam,
        inscricao_estadual_proprietario: vehicle.owner.ie,
        tipo_fretamento: vehicle.type,
        tipo_proprietario: vehicle.owner.type,
        uf_licenciamento: vehicle.uf,
        uf_proprietario: vehicle.owner.uf,
      },
    };

    if (vehicle.owner.cnpj) {
      request.modal_rodoviario.cnpj_proprietario = vehicle.owner.cnpj;
    }
    if (vehicle.owner.cpf) {
      request.modal_rodoviario.cpf_proprietario = vehicle.owner.cpf;
    }

    if (vehicle.taf && request.uf_fim != request.uf_inicio) {
      request.modal_rodoviario.taf = vehicle.taf;
      delete request.modal_rodoviario.numero_registro_estadual;
    }

    if (request.uf_inicio == request.uf_fim) {
      delete request.modal_rodoviario.taf;
    }

    // Tributação - 16/11/2023
    request.icms_indicador_simples_nacional = 0;

    if (request.uf_fim == 'RS') {
      // No RS
      // -> CST 020
      // -> redução de 80% da base de calculo do ICMS
      // -> e aplicar alíquota interna do transporte de 12%

      request.icms_reducao_base_calculo = '80.0';
      request.icms_aliquota = '12.0';

      request.icms_base_calculo = Number(request.valor_total) * 0.2;
      request.icms_valor = request.icms_base_calculo * 0.12;

      request.icms_situacao_tributaria = '20';

      request.observacoes =
        request.observacoes +
        ' - Redução de Base de Cálculo  de ICMS conforme Artigo 24, inciso I, do Livro I do RICMS/RS';
    }

    if (request.uf_fim != 'RS') {
      // Fora do Estado
      // -> CST 000
      request.icms_situacao_tributaria = '00';
      request.icms_base_calculo = Number(request.valor_total);

      if (['MG', 'PR', 'RJ', 'SC', 'SP'].includes(request.uf_fim)) {
        // -> alíquota 12%
        request.icms_aliquota = '12.0';
        request.icms_valor = Number(request.valor_total) * 0.12;
      } else {
        // -> alíquota 7%
        request.icms_aliquota = '7.0';
        request.icms_valor = Number(request.valor_total) * 0.07;
      }
    }

    if (request.inscricao_estadual_tomador) {
      // Clientes que possuem Inscrição Estadual sair no CFOP 6353
      request.cfop = '6353';
    }

    const ref = randomUUID();

    console.log('------ REQUEST ----------');
    console.log(request);
    console.log(
      `${env.FOCUS_NFE_BASE_URL}/cte_os?ref=${ref}&token=${env.FOCUS_NFE_TOKEN}`,
    );

    const response = await axios.post(
      `${env.FOCUS_NFE_BASE_URL}/cte_os?ref=${ref}&token=${env.FOCUS_NFE_TOKEN}`,
      request,
      { validateStatus: () => true },
    );

    if (Number(response.data.status_sefaz) >= 400 || response.status >= 400) {
      return response;
    }

    let cteos = await this.cteosRepository.create({ ...response.data });

    try {
      const response = await axios.get(
        `${env.FOCUS_NFE_BASE_URL}/cte/${ref}?completa=1&token=${env.FOCUS_NFE_TOKEN}`,
      );
      await this.cteosRepository.update(
        { _id: String(cteos._id) },
        { ...response.data },
      );
      cteos = { ...cteos, ...response.data };
    } catch (e) {
      console.log(e);
    }

    return {
      status: 201,
      data: cteos,
    };
  }
}
