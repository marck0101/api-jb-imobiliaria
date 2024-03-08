import { ICasa } from '@/@types/casa';
import { model, Schema } from 'mongoose';

export const schema = new Schema<ICasa>(
  {
    name: {
      type: String,
      required: false,
    },

    descriptionCapa: {
      type: String,
      required: false,
    },

    tipoLocacao: {
      type: String,
      required: true,
    },

    garagem: {
      vagas: {
        type: Number,
        required: true,
      },
    },

    banheiro: {
      banheiro: {
        type: Number,
        required: true,
      },
      lavabo: {
        type: Number,
        required: true,
      },
    },

    cozinha: {
      type: Number,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    salas: {
      type: String,
      required: true,
    },
    dormitorio: {
      dormitorio: {
        type: Number,
        required: true,
      }, // quartos
      suite: {
        type: Number,
        required: true,
      }, // se for igual a 0 tratamos de não apresentar
    },
    sacada: {
      type: Number,
      required: true,
    },
    elevador: {
      type: Boolean,
      required: true,
    },
    areaServico: {
      type: Boolean,
      required: true,
    }, // lavanderia
    churrasqueira: {
      type: Boolean,
      required: true,
    }, // churrasqueira
    iframeLocalizacao: {
      type: String,
      required: true,
    }, // codigo de incorporação
    observacao: {
      type: String,
      required: true,
    }, // observação caso necessário
    metrosQuadrados: {
      type: Number,
      required: true,
    }, // m²
    valorLocacao: {
      type: Number,
      required: true,
    },
    codImovel: {
      type: Number,
      required: true,
    },

    archivedAt: String,
  },
  { timestamps: true },
);

export const Casa = model('Casa', schema);
