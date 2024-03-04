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

// src/use-cases/cteos/create-cteos.ts
var create_cteos_exports = {};
__export(create_cteos_exports, {
  CreateCteosUseCase: () => CreateCteosUseCase
});
module.exports = __toCommonJS(create_cteos_exports);

// src/config/env.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
var import_zod = require("zod");
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
console.log(`=> API running with ${process.env.NODE_ENV?.toUpperCase() || "DEV"} environment!`);
console.log("======================================");
var DEFAULT_PORT = 7e3;
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.string().default("dev"),
  PORT: import_zod.z.coerce.number().default(DEFAULT_PORT),
  DB_NAME: import_zod.z.string().default("jbimobiliaria"),
  DB_URL: import_zod.z.string().default("mongodb://localhost:27017"),
  REDIS_URL: import_zod.z.string().default("127.0.0.1"),
  SECRET_AUTH: import_zod.z.string().default("1GH23jduihsSqFi6oedpniUask29OGpwmnSugGwziviIvoVNB3BF3daw5"),
  EXPIRE_AUTH: import_zod.z.string().default("1d"),
  FOCUS_NFE_BASE_URL: import_zod.z.string().default("https://homologacao.focusnfe.com.br/v2"),
  FOCUS_NFE_TOKEN: import_zod.z.string().default("hb5mYGx64HAZEEqVkku1aE0jJ2SUg4YG"),
  API_URL: import_zod.z.string().default(`http://localhost:${DEFAULT_PORT}`)
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("\u274C Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment varibles.");
}
var env = _env.data;
console.log(env);

// src/use-cases/cteos/create-cteos.ts
var import_axios = __toESM(require("axios"), 1);
var import_crypto = require("crypto");

// src/models/logs.ts
var import_mongoose = require("mongoose");
var schema = new import_mongoose.Schema({
  level: String,
  message: String,
  data: Object,
  path: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
var Logs = (0, import_mongoose.model)("Logs", schema);

// src/utils/logger.ts
var import_winston = __toESM(require("winston"), 1);
var LOGS_LEVELS = {
  emergency: 0,
  //system is unusable
  alert: 1,
  //action must be taken immediately
  critical: 2,
  //critical conditions
  error: 3,
  //error conditions
  warning: 4,
  //warning conditions
  notice: 5,
  //normal but significant condition
  info: 6,
  //informational messages
  debug: 7
  //debug level messages
};
var MongoTransport = class extends import_winston.default.Transport {
  constructor(opts) {
    super(opts);
  }
  async log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });
    const log = new Logs({
      level: info.level,
      message: info.message,
      data: info.data || {},
      path: info.path,
      timestamp: Date.now()
    });
    await log.save();
    callback();
  }
};
var logger = import_winston.default.createLogger({
  levels: LOGS_LEVELS,
  format: import_winston.format.combine(
    import_winston.format.json()
  ),
  transports: [
    new MongoTransport()
  ]
});
var COLORS = {
  emergency: "\x1B[41m",
  alert: "\x1B[43m",
  critical: "\x1B[41m",
  error: "\x1B[41m",
  warning: "\x1B[43m",
  notice: "\x1B[43m",
  info: "\x1B[46m",
  debug: "\x1B[45m"
};
var custom = import_winston.format.printf((data) => {
  const message = `${COLORS[data.level]} ${data.level.toUpperCase()} \x1B[0m ${data.message}`;
  return !data.data ? message : message + `
${JSON.stringify(data)}`;
});
if (process.env.BUILD !== "prod") {
  logger.add(new import_winston.transports.Console({ format: import_winston.format.combine(custom), level: "debug" }));
}

// src/utils/errors.ts
var DefaultError = class extends Error {
  constructor(message, options = {}) {
    super(message);
    this.status = options.status || 400;
    this.level = options.level || "error";
    this.data = options.data || {};
    this.description = options.description || {};
    this.UIDescription = options.UIDescription || {};
    this.errors = options.errors;
    this.path = options.path || this.stack;
    this.details = options.details || [];
    this.log();
  }
  log() {
    const log = {
      level: this.level || "error",
      message: this.message,
      path: this.path,
      data: {}
    };
    if (this.data && Object.keys(this.data).length)
      log.data = this.data;
    logger.log(log);
  }
};
var ResourceNotFoundError = class extends DefaultError {
  constructor(params = {}) {
    super("Resource not found.", {
      description: {
        "en": "The server could not find the requested resource.",
        "pt-br": "O servidor n\xE3o encontrou o recurso requisitado."
      },
      level: "notice",
      status: params.status || 404,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "O servidor n\xE3o conseguiu encontrar o recurso solicitado."
      }
    });
  }
};

// src/utils/decode-token.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// src/use-cases/vehicles/get-vehicle.ts
var GetVehicleUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(_id) {
    const vehicle = await this.repository.getById(_id);
    if (!vehicle) {
      throw new ResourceNotFoundError({ data: { _id } });
    }
    return vehicle;
  }
};

// src/use-cases/cteos/create-cteos.ts
var DEFAULT = {
  "bairro_emitente": "Bela Uni\xE3o",
  "cep_emitente": "98900000",
  "cnpj_emitente": "05435582000152",
  "codigo_municipio_emitente": "4317202",
  "codigo_municipio_envio": "4317202",
  "inscricao_estadual_emitente": "1100090700",
  "codigo_pais_tomador": "1058",
  "pais_tomador": "Brasil",
  "icms_aliquota": "0.00",
  "icms_base_calculo": "0.00",
  "icms_situacao_tributaria": "90_simples_nacional",
  "icms_indicador_simples_nacional": 1,
  "icms_valor": "0.00",
  "logradouro_emitente": "Rua Bela Uni\xE3o",
  "modal": "01",
  "municipio_emitente": "Santa Rosa",
  "municipio_envio": "Santa Rosa",
  "nome_emitente": "VDR PETRI TURISMO LTDA",
  "nome_fantasia_emitente": "VDR PETRI TURISMO LTDA",
  "numero_emitente": "1136",
  "quantidade": "1.00",
  "telefone_emitente": "5535116020",
  "tipo_documento": 0,
  "uf_emitente": "RS",
  "uf_envio": "RS",
  "valor_desconto_fatura": "0.00",
  "valor_liquido_fatura": "1.00",
  "valor_original_fatura": "1.00",
  "valor_total_tributos": "0.00",
  "valor_pis": "0.00",
  "valor_cofins": "0.00"
};
var CreateCteosUseCase = class {
  constructor(vehiclesRepository, cteosRepository) {
    this.vehiclesRepository = vehiclesRepository;
    this.cteosRepository = cteosRepository;
  }
  async execute(data) {
    const getVehicleUseCase = new GetVehicleUseCase(this.vehiclesRepository);
    const vehicle = await getVehicleUseCase.execute(data.modal_rodoviario);
    const request = {
      ...data,
      ...DEFAULT,
      data_emissao: (/* @__PURE__ */ new Date()).toISOString(),
      numero_fatura: (0, import_crypto.randomUUID)(),
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
        uf_proprietario: vehicle.owner.uf
      }
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
    request.icms_indicador_simples_nacional = 0;
    if (request.uf_fim == "RS") {
      request.icms_reducao_base_calculo = "80.0";
      request.icms_aliquota = "12.0";
      request.icms_base_calculo = Number(request.valor_total) * 0.2;
      request.icms_valor = request.icms_base_calculo * 0.12;
      request.icms_situacao_tributaria = "20";
      request.observacoes = request.observacoes + " - Redu\xE7\xE3o de Base de C\xE1lculo  de ICMS conforme Artigo 24, inciso I, do Livro I do RICMS/RS";
    }
    if (request.uf_fim != "RS") {
      request.icms_situacao_tributaria = "00";
      request.icms_base_calculo = Number(request.valor_total);
      if (["MG", "PR", "RJ", "SC", "SP"].includes(request.uf_fim)) {
        request.icms_aliquota = "12.0";
        request.icms_valor = Number(request.valor_total) * 0.12;
      } else {
        request.icms_aliquota = "7.0";
        request.icms_valor = Number(request.valor_total) * 0.07;
      }
    }
    if (request.inscricao_estadual_tomador) {
      request.cfop = "6353";
    }
    const ref = (0, import_crypto.randomUUID)();
    console.log("------ REQUEST ----------");
    console.log(request);
    console.log(`${env.FOCUS_NFE_BASE_URL}/cte_os?ref=${ref}&token=${env.FOCUS_NFE_TOKEN}`);
    const response = await import_axios.default.post(`${env.FOCUS_NFE_BASE_URL}/cte_os?ref=${ref}&token=${env.FOCUS_NFE_TOKEN}`, request, { validateStatus: () => true });
    if (Number(response.data.status_sefaz) >= 400 || response.status >= 400) {
      return response;
    }
    let cteos = await this.cteosRepository.create({ ...response.data });
    try {
      const response2 = await import_axios.default.get(`${env.FOCUS_NFE_BASE_URL}/cte/${ref}?completa=1&token=${env.FOCUS_NFE_TOKEN}`);
      await this.cteosRepository.update({ _id: String(cteos._id) }, { ...response2.data });
      cteos = { ...cteos, ...response2.data };
    } catch (e) {
      console.log(e);
    }
    return {
      status: 201,
      data: cteos
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateCteosUseCase
});
