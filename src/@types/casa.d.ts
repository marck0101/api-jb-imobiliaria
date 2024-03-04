export interface ICasa {
  _id: string

  name: string
  descriptionCapa: string
  tipoLocacao: string
  garagem: {
    vagas: number
  }

  banheiro: {
    banheiro: number
    lavabo: number
  }
  cozinha: number
  tipo: string // venda ou locacao
  salas: string // sala
  dormitorio: {
    dormitorio: number // quartos
    suite: number // se for igual a 0 tratamos de não apresentar
  }
  sacada: number // se for igual a 0 tratamos de não apresentar
  elevador: boolean //  elevador

  areaServico: boolean // lavanderia
  churrasqueira: boolean // churrasqueira
  iframeLocalizacao: string // codigo de incorporação
  observacao: string // observação caso necessário

  metrosQuadrados: number // m²
  valorLocacao: number
  codImovel: number

  // //---------------
  createdAt: string
  updatedAt: string
  archivedAt: string
  // // archivedAt: Date
}
