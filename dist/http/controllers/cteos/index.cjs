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

// src/http/controllers/cteos/index.ts
var cteos_exports = {};
__export(cteos_exports, {
  createCteos: () => createCteos,
  deleteCteos: () => deleteCteos,
  fetchCteos: () => fetchCteos,
  updateCteos: () => updateCteos
});
module.exports = __toCommonJS(cteos_exports);

// src/models/cteos.ts
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

// src/models/logs.ts
var import_mongoose2 = require("mongoose");
var schema2 = new import_mongoose2.Schema({
  level: String,
  message: String,
  data: Object,
  path: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
var Logs = (0, import_mongoose2.model)("Logs", schema2);

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
var ValidationError = class extends DefaultError {
  constructor(params = {}) {
    super("Invalid data.", {
      description: params.description ? params.description : {
        "en": "The request contains semantic errors or invalid data that prevents processing.",
        "pt-br": "A solicita\xE7\xE3o cont\xE9m inconsist\xEAncias sem\xE2nticas ou dados inv\xE1lidos que est\xE3o impedindo o processamento adequado."
      },
      level: "warning",
      status: params.status || 422,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "A requisi\xE7\xE3o \xE9 invalida."
      },
      details: params.details || []
    });
  }
};
var DatabaseError = class extends DefaultError {
  constructor(params = {}) {
    super("An error occurred while accessing or querying the database.", {
      description: {
        "en": "An error occurred while accessing or querying the database.",
        "pt-br": "Ocorreu um erro ao acessar ou consultar o banco de dados."
      },
      level: "critical",
      status: params.status || 500,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "Ocorreu um erro ao acessar o banco de dados."
      }
    });
  }
};

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

// src/utils/decode-token.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// src/repositories/mongo/mongo-cteos-repository.ts
var MongoCteosRepository = class {
  async create(data) {
    try {
      const cteos = new Cteos(data);
      await cteos.save();
      return cteos;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }
  async get(options = {}) {
    try {
      const limit = options.limit || 10;
      const skip = options.skip || 0;
      const cteos = await Cteos.find(options.filter || {}, options.projection || {}).sort({ createdAt: -1 }).limit(limit).skip(skip).lean();
      return cteos;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async count(filter) {
    try {
      const cteos = await Cteos.count(filter || {});
      return cteos;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async update(query, data) {
    try {
      await Cteos.updateOne(query, data);
    } catch (e) {
      throw new DatabaseError({ data: { data, query } });
    }
  }
};

// src/models/vehicle.ts
var import_mongoose3 = require("mongoose");
var schema3 = new import_mongoose3.Schema({
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
var Vehicles = (0, import_mongoose3.model)("Vehicles", schema3);

// src/repositories/mongo/mongo-vehicles-repository.ts
var MongoVehiclesRepository = class {
  async create(data) {
    try {
      const vehicle = new Vehicles(data);
      await vehicle.save();
      return vehicle;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }
  async update(_id, data) {
    try {
      const result = await Vehicles.updateOne({ _id }, data);
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id, ...data } });
    }
  }
  async archive(_id) {
    try {
      const result = await Vehicles.updateOne({ _id }, { archivedAt: /* @__PURE__ */ new Date() });
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }
  async get(query = {}) {
    try {
      const result = await Vehicles.find(query);
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async getById(_id) {
    try {
      const result = await Vehicles.findOne({ _id });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
};

// src/use-cases/cteos/create-cteos.ts
var import_axios = __toESM(require("axios"), 1);
var import_crypto = require("crypto");

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

// src/utils/validator.ts
var Validator = class {
  constructor(schema5) {
    if (!schema5) {
      throw new Error("schema must be provided in construct of Validator class");
    }
    this.schema = schema5;
  }
  parse(data = {}) {
    try {
      return this.schema.parse(data);
    } catch (e) {
      const error = e;
      throw new ValidationError({ data, details: error.errors });
    }
  }
};

// src/http/controllers/cteos/create-cteos.ts
var import_zod2 = require("zod");
var schema4 = import_zod2.z.object({
  cfop: import_zod2.z.string().nonempty(),
  bairro_tomador: import_zod2.z.string().nonempty(),
  logradouro_tomador: import_zod2.z.string().nonempty(),
  cep_tomador: import_zod2.z.string().nonempty(),
  codigo_municipio_tomador: import_zod2.z.string().nonempty(),
  municipio_tomador: import_zod2.z.string().nonempty(),
  uf_tomador: import_zod2.z.string().nonempty(),
  numero_tomador: import_zod2.z.string().nonempty(),
  cnpj_tomador: import_zod2.z.string().optional(),
  cpf_tomador: import_zod2.z.string().optional(),
  nome_fantasia_tomador: import_zod2.z.string().nonempty(),
  nome_tomador: import_zod2.z.string().nonempty(),
  codigo_municipio_fim: import_zod2.z.string().nonempty(),
  codigo_municipio_inicio: import_zod2.z.string().nonempty(),
  descricao_servico: import_zod2.z.string().nonempty(),
  indicador_inscricao_estadual_tomador: import_zod2.z.string().nonempty(),
  municipio_fim: import_zod2.z.string().nonempty(),
  municipio_inicio: import_zod2.z.string().nonempty(),
  natureza_operacao: import_zod2.z.string().nonempty(),
  tipo_servico: import_zod2.z.enum(["6", "7", "8"]),
  uf_fim: import_zod2.z.string().nonempty(),
  uf_inicio: import_zod2.z.string().nonempty(),
  valor_receber: import_zod2.z.number().min(0),
  valor_total: import_zod2.z.number().min(0),
  modal_rodoviario: import_zod2.z.string().nonempty(),
  percursos: import_zod2.z.array(import_zod2.z.unknown()).optional()
});
async function createCteos(request, response, next) {
  try {
    const validator = new Validator(schema4);
    validator.parse(request.body);
    const vehiclesRepository = new MongoVehiclesRepository();
    const cteosRepository = new MongoCteosRepository();
    const createCteosUseCase = new CreateCteosUseCase(vehiclesRepository, cteosRepository);
    const result = await createCteosUseCase.execute(request.body);
    response.status(result.status || 200).json(result.data);
  } catch (e) {
    next(e);
  }
}

// src/use-cases/cteos/cancel-cteos.ts
var import_axios3 = __toESM(require("axios"), 1);

// src/use-cases/cteos/update-cteos.ts
var import_axios2 = __toESM(require("axios"), 1);
var UpdateCteosUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    const response = await import_axios2.default.get(`${env.FOCUS_NFE_BASE_URL}/cte/${data.ref}?completa=1&token=${env.FOCUS_NFE_TOKEN}`);
    await this.repository.update({ ref: data.ref }, { ...response.data });
  }
};

// src/use-cases/cteos/cancel-cteos.ts
var CancelCteosUseCase = class {
  async execute({ ref, justificativa }) {
    console.log(`${env.FOCUS_NFE_BASE_URL}/cte/${ref}?token=${env.FOCUS_NFE_TOKEN}`, { justificativa });
    const response = await import_axios3.default.delete(`${env.FOCUS_NFE_BASE_URL}/cte/${ref}?token=${env.FOCUS_NFE_TOKEN}`, {
      data: { justificativa },
      headers: {
        "Content-Type": "application/json"
      },
      validateStatus: () => true
    });
    if (response.status == 200) {
      const mongoCteosRepository = new MongoCteosRepository();
      const updateCteosUseCase = new UpdateCteosUseCase(mongoCteosRepository);
      await updateCteosUseCase.execute({ ref });
    }
    return response;
  }
};

// src/http/controllers/cteos/delete-cteos.ts
async function deleteCteos(request, response, next) {
  try {
    if (!request.params.id || !request.query.justificativa) {
      throw new ValidationError();
    }
    const cancelCteosUseCase = new CancelCteosUseCase();
    const { status, data } = await cancelCteosUseCase.execute({ ref: request.params.id, justificativa: request.query.justificativa });
    response.status(status || 200).json(data);
  } catch (e) {
    next(e);
  }
}

// src/use-cases/cteos/fetch-cteos.ts
var FetchCteosUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(query = {}) {
    const [data, count] = await Promise.all([
      this.repository.get(query),
      this.repository.count(query?.filter || {})
    ]);
    return { data, count };
  }
};

// src/http/controllers/cteos/fetch-cteos.ts
async function fetchCteos(request, response, next) {
  try {
    const repository = new MongoCteosRepository();
    const query = { ...request.query };
    query.filter = {};
    if (query.status) {
      query.filter.status = query.status;
      delete query.status;
    }
    if (query.name) {
      query.filter.name = { $regex: query.name };
      delete query.name;
    }
    if (query.since && query.to) {
      query.filter.createdAt = { $gte: query.since, $lte: query.to };
      delete query.since;
      delete query.to;
    }
    const fetchCteosUseCase = new FetchCteosUseCase(repository);
    const { data, count } = await fetchCteosUseCase.execute(query);
    response.status(200).json({ data, count });
  } catch (e) {
    next(e);
  }
}

// src/http/controllers/cteos/update-cteos.ts
async function updateCteos(request, response, next) {
  try {
    console.log("\u2705 Recebeu um webhook!");
    if (!request.body.ref) {
      throw new ValidationError();
    }
    const cteosRepository = new MongoCteosRepository();
    const updateCteosUseCase = new UpdateCteosUseCase(cteosRepository);
    await updateCteosUseCase.execute({ ref: request.params.ref });
    response.status(200).json({ ok: true });
  } catch (e) {
    next(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCteos,
  deleteCteos,
  fetchCteos,
  updateCteos
});
