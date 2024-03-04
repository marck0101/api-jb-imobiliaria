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

// src/http/controllers/customers/update-customers.ts
var update_customers_exports = {};
__export(update_customers_exports, {
  updateCustomer: () => updateCustomer
});
module.exports = __toCommonJS(update_customers_exports);

// src/models/customer.ts
var import_mongoose = require("mongoose");
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
var Customers = (0, import_mongoose.model)("Customers", schema);

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

// src/repositories/mongo/mongo-customers-repository.ts
var MongoCustumerRepository = class {
  async create(data) {
    try {
      const customers = new Customers(data);
      await customers.save();
      return customers;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }
  async update(_id, data) {
    try {
      const result = await Customers.updateOne({ _id }, data);
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id, ...data } });
    }
  }
  async archive(_id) {
    try {
      const result = await Customers.updateOne({ _id }, { archivedAt: /* @__PURE__ */ new Date() });
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }
  async get(query = {}) {
    try {
      const result = await Customers.find(query);
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async getById(_id) {
    try {
      const result = await Customers.findOne({ _id });
      return result;
    } catch (e) {
      console.log("Aqui o erro", e);
      throw new DatabaseError();
    }
  }
  async getCpf(cpf) {
    try {
      const result = await Customers.findOne({ cpf });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async getCnpj(cnpj) {
    try {
      const result = await Customers.findOne({ cnpj });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async getPhone(phone) {
    try {
      const result = await Customers.findOne({ phone });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async getRg(rg) {
    try {
      const result = await Customers.findOne({ rg });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async getEmail(email) {
    try {
      const result = await Customers.findOne({ email });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
};

// src/use-cases/customers/get-customers.ts
var GetCustomersUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(_id) {
    const customers = await this.repository.getById(_id);
    if (!customers) {
      throw new ResourceNotFoundError({ data: { _id } });
    }
    return customers;
  }
};

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

// src/utils/validator.ts
var Validator = class {
  constructor(schema4) {
    if (!schema4) {
      throw new Error("schema must be provided in construct of Validator class");
    }
    this.schema = schema4;
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

// src/http/controllers/customers/update-customers.ts
var import_zod2 = require("zod");
var schema3 = import_zod2.z.object({
  name: import_zod2.z.string().optional(),
  fantasyname: import_zod2.z.string().optional(),
  email: import_zod2.z.string().optional(),
  birthdate: import_zod2.z.string().optional(),
  cpf: import_zod2.z.string().optional(),
  cnpj: import_zod2.z.string().optional(),
  phone: import_zod2.z.string().optional(),
  rg: import_zod2.z.string().optional(),
  address: import_zod2.z.object({
    cep: import_zod2.z.string().optional(),
    city: import_zod2.z.string().optional(),
    number: import_zod2.z.string().optional(),
    bairro: import_zod2.z.string().optional(),
    state: import_zod2.z.string().optional(),
    street: import_zod2.z.string().optional()
  }).optional(),
  files: import_zod2.z.array(import_zod2.z.object({
    name: import_zod2.z.string().optional(),
    url: import_zod2.z.string().optional(),
    size: import_zod2.z.number().optional(),
    type: import_zod2.z.string().optional()
  }).optional())
});
async function updateCustomer(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError();
    }
    const validator = new Validator(schema3);
    console.log(request.body);
    validator.parse(request.body);
    const customersRepository = new MongoCustumerRepository();
    const updateCustomersUseCase = new UpdateCustomersUseCase(customersRepository);
    const getCustomerUseCase = new GetCustomersUseCase(customersRepository);
    if (!request.query.deleteFiles) {
      const customer = await getCustomerUseCase.execute(request.params.id);
      console.log("customer", customer);
      console.log("request.body", request.body);
      if (request.body.files) {
        request.body.files = [...customer.files, ...request.body.files];
      }
    }
    await updateCustomersUseCase.execute(request.params.id, request.body);
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateCustomer
});
