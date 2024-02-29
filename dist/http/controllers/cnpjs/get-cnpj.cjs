"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/cnpjs/get-cnpj.ts
var get_cnpj_exports = {};
__export(get_cnpj_exports, {
  getCnpj: () => getCnpj
});
module.exports = __toCommonJS(get_cnpj_exports);

// src/use-cases/cnpjs/get-cnpj.ts
var import_axios = __toESM(require("axios"), 1);
var GetCnpjUseCase = class {
  async execute({ cnpj }) {
    const url = ` https://3S6IOjm4PAM4Tpvf8Typcva4IjxZieTB@api.focusnfe.com.br/v2/cnpjs/${cnpj}`;
    const { data, status } = await import_axios.default.get(url, { validateStatus: () => true });
    return { data, status };
  }
};

// src/http/controllers/cnpjs/get-cnpj.ts
async function getCnpj(request, response, next) {
  try {
    const getCnpjUseCase = new GetCnpjUseCase();
    const { data, status } = await getCnpjUseCase.execute({ cnpj: request.params.cnpj });
    return response.status(status || 200).json(data);
  } catch (e) {
    next(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCnpj
});
