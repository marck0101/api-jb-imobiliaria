/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === 'object' || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/models/customer.ts
var customer_exports = {};
__export(customer_exports, {
  Customers: () => Customers,
  schema: () => schema
});
module.exports = __toCommonJS(customer_exports);
var import_mongoose = require('mongoose');
var file = new import_mongoose.Schema({
  name: String,
  url: String,
  size: Number,
  type: String
});
var schema = new import_mongoose.Schema({
  archivedAt: Date,
  name: {
    type: String,
    required: true
  },
  fantasyname: {
    type: String
    // required: false,
  },
  email: {
    type: String
    // required: false,
  },
  birthdate: {
    type: String
    // required: false,
  },
  cpf: {
    type: String
    // required: false,
  },
  cnpj: {
    type: String
    // required: false,
  },
  phone: {
    type: String
    // required: false,
  },
  rg: {
    type: String
    // required: false,
  },
  
  takerIndicator: {
    type: String
  },

  borrowerRegistration: {
    type: String
  },

  files: [
    file
  ],
  address: {
    cep: {
      type: String
      // required: false,
    },
    city: {
      type: String
      // required: false,
    },
    number: {
      type: String
      // required: false,
    },
    state: {
      type: String
      // required: false,
    },
    street: {
      type: String
      // required: false,
    },
    bairro: {
      type: String
      // required: false,
    }
  }
}, { timestamps: true });

console.log('schema',schema);

var Customers = (0, import_mongoose.model)('Customers', schema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Customers,
  schema
});
