import { IVehicle } from '@/@types/vehicle';
import { model, Schema } from 'mongoose';

export const schema = new Schema<IVehicle>(
  {
    name: {
      type: String,
      required: true,
    },
    manufacturingYear: {
      type: Number,
      required: true,
    },
    modelYear: {
      type: Number,
      required: true,
    },
    //marca - modelo - versão
    mmv: {
      type: String,
      required: true,
    },
    taf: String,

    nre: {
      type: String,
      required: true,
    },
    renavam: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    uf: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['1', '2'],
      required: true,
    },

    color: {
      type: String,
      required: false,
    },

    owner: {
      cpf: String,
      cnpj: String,
      corporateName: {
        type: String,
        required: true,
      },
      ie: {
        type: String,
        required: true,
      },
      uf: {
        type: String,
        required: true,
      },
      taf: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: ['0', '1', '2'],
        required: true,
      },
    },

    archivedAt: Date,
  },
  { timestamps: true },
);

export const Vehicles = model('Vehicles', schema);
