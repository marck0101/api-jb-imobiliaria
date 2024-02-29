"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/models/vehicle.ts
var vehicle_exports = {};
__export(vehicle_exports, {
  Vehicles: () => Vehicles,
  schema: () => schema
});
module.exports = __toCommonJS(vehicle_exports);
var import_mongoose = require("mongoose");
var schema = new import_mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  manufacturingYear: {
    type: Number,
    required: true
  },
  modelYear: {
    type: Number,
    required: true
  },
  //marca - modelo - versão
  mmv: {
    type: String,
    required: true
  },
  taf: String,
  nre: {
    type: String,
    required: true
  },
  renavam: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  uf: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["1", "2"],
    required: true
  },
  owner: {
    cpf: String,
    cnpj: String,
    corporateName: {
      type: String,
      required: true
    },
    ie: {
      type: String,
      required: true
    },
    uf: {
      type: String,
      required: true
    },
    taf: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["0", "1", "2"],
      required: true
    }
  },
  archivedAt: Date
}, { timestamps: true });
var Vehicles = (0, import_mongoose.model)("Vehicles", schema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Vehicles,
  schema
});
