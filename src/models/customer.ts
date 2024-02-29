import { ICustomer } from '@/@types/customer';
import { model, Schema } from 'mongoose';

const file = new Schema({
  name: String,
  url: String,
  size: Number,
  type: String,
});

export const schema = new Schema<ICustomer>(
  {
    archivedAt: Date,

    name: {
      type: String,
      required: true,
    },
    fantasyname: {
      type: String,
      // required: false,
    },
    email: {
      type: String,
      // required: false,
    },

    birthdate: {
      type: String,
      // required: false,
    },

    cpf: {
      type: String,
      // required: false,
    },
    cnpj: {
      type: String,
      // required: false,
    },

    phone: {
      type: String,
      // required: false,
    },
    rg: {
      type: String,
      // required: false,
    },

    takerIndicator: {
      type: String,
    },

    borrowerRegistration: {
      type: String,
    },

    files: [file],

    address: {
      cep: {
        type: String,
        // required: false,
      },
      city: {
        type: String,
        // required: false,
      },
      number: {
        type: String,
        // required: false,
      },
      state: {
        type: String,
        // required: false,
      },
      street: {
        type: String,
        // required: false,
      },
      bairro: {
        type: String,
        // required: false,
      },
    },
  },
  { timestamps: true },
);

export const Customers = model('Customers', schema);
