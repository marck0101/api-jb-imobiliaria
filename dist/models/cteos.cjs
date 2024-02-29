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

// src/models/cteos.ts
var cteos_exports = {};
__export(cteos_exports, {
  Cteos: () => Cteos,
  schema: () => schema
});
module.exports = __toCommonJS(cteos_exports);
var import_mongoose = require("mongoose");
var schema = new import_mongoose.Schema({
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
var Cteos = (0, import_mongoose.model)("Cteos", schema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cteos,
  schema
});
