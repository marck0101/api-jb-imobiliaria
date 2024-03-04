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

// src/use-cases/customers/update-customers.ts
var update_customers_exports = {};
__export(update_customers_exports, {
  UpdateCustomersUseCase: () => UpdateCustomersUseCase
});
module.exports = __toCommonJS(update_customers_exports);

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
var DuplicateConflictError = class extends DefaultError {
  constructor(params = {}) {
    super("Duplicate conflict.", {
      description: {
        "en": "The request can not be completed because the resource or process already exists.",
        "pt-br": "A solicita\xE7\xE3o n\xE3o pode ser conclu\xEDda pois o recurso ou processo j\xE1 existe"
      },
      level: "notice",
      status: params.status || 409,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "O objeto ou processo j\xE1 existe ou est\xE1 duplicado."
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

// src/use-cases/customers/update-customers.ts
var UpdateCustomersUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(_id, data) {
    const customer = await this.repository.getById(_id);
    console.log("customer", customer);
    if (!customer) {
      throw new Error("");
    }
    if (customer.cpf === data.cpf) {
      delete data.cpf;
    }
    if (customer.cnpj === data.cnpj) {
      delete data.cnpj;
    }
    if (customer.phone === data.phone) {
      delete data.phone;
    }
    if (customer.rg === data.rg) {
      delete data.rg;
    }
    if (customer.email === data.email) {
      delete data.email;
    }
    if (data.cpf) {
      const buscaCpfExistente = await this.repository.getCpf(data.cpf);
      if (buscaCpfExistente) {
        throw new DuplicateConflictError({ UIDescription: { "pt-br": "Cpf j\xE1 existe com outro usu\xE1rio!" } });
      }
    }
    if (data.cnpj) {
      const buscaCnpjExistente = await this.repository.getCnpj(data.cnpj);
      if (buscaCnpjExistente) {
        throw new DuplicateConflictError({ UIDescription: { "pt-br": "Cnpj j\xE1 existe com outro usu\xE1rio!" } });
      }
    }
    if (data.phone) {
      const buscaPhoneExistente = await this.repository.getPhone(data.phone);
      if (buscaPhoneExistente) {
        throw new DuplicateConflictError({ UIDescription: { "pt-br": "Telefone j\xE1 existe com outro usu\xE1rio!" } });
      }
    }
    if (data.rg) {
      const buscaRgExistente = await this.repository.getRg(data.rg);
      if (buscaRgExistente) {
        throw new DuplicateConflictError({ UIDescription: { "pt-br": "RG j\xE1 existe com outro usu\xE1rio!" } });
      }
    }
    if (data.email) {
      const buscaEmailExistente = await this.repository.getEmail(data.email);
      if (buscaEmailExistente) {
        throw new DuplicateConflictError({ UIDescription: { "pt-br": "Email j\xE1 existe com outro usu\xE1rio!" } });
      }
    }
    await this.repository.update(_id, data);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateCustomersUseCase
});
