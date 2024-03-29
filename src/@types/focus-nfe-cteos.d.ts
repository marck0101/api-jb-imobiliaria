


export interface IFocusNFeCteos {

  bairro_emitente: string
  bairro_tomador: string
  cep_emitente: string
  cep_tomador: string
  cfop: string
  cnpj_emitente: string
  cnpj_tomador: string
  codigo_municipio_emitente: string
  codigo_municipio_envio: string
  codigo_municipio_fim: string
  codigo_municipio_inicio: string
  codigo_municipio_tomador: string
  codigo_pais_tomador: string
  data_emissao: string
  descricao_servico: string
  icms_aliquota: string
  icms_situacao_tributaria: string
  indicador_inscricao_estadual_tomador: string
  inscricao_estadual_emitente: string
  logradouro_emitente: string
  logradouro_tomador: string
  modal: string;
  modal_rodoviario: ModalRodoviario
  municipio_emitente: string
  municipio_envio: string
  municipio_fim: string
  municipio_inicio: string
  municipio_tomador: string
  natureza_operacao: string
  nome_emitente: string
  nome_fantasia_emitente: string
  nome_fantasia_tomador: string
  nome_tomador: string
  numero_emitente: string
  numero_fatura: string
  numero_tomador: string
  pais_tomador: string
  quantidade: string
  telefone_emitente: string
  tipo_documento: number
  tipo_servico: number
  uf_emitente: string
  uf_envio: string
  uf_fim: string
  uf_inicio: string
  uf_tomador: string
  valor_desconto_fatura: string
  valor_inss: string
  valor_liquido_fatura: string
  valor_original_fatura: string
  valor_receber: string
  valor_total: string
  valor_total_tributos: string
  seguros_carga?: SegurosCarga;

  icms_indicador_simples_nacional?: number;
  icms_reducao_base_calculo?: string;
  icms_base_calculo?: number | string;
  icms_valor?: number | string;

  inscricao_estadual_tomador?: string;
  observacoes?: string;
}

interface SegurosCarga {
  responsavel_seguro: string;
  nome_seguradora: string;
  numero_apolice: string;
}

export interface ModalRodoviario {
  numero_registro_estadual?: string
  taf_proprietario: string
  razao_social_proprietario: string
  placa: string
  renavam: string
  inscricao_estadual_proprietario: string
  tipo_fretamento: string
  tipo_proprietario: string
  uf_licenciamento: string
  uf_proprietario: string
  taf?: string;
  cpf_proprietario?: string;
  cnpj_proprietario?: string;
}
