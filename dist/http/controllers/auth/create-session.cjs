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

// src/http/controllers/auth/create-session.ts
var create_session_exports = {};
__export(create_session_exports, {
  createSession: () => createSession
});
module.exports = __toCommonJS(create_session_exports);

// src/models/admin.ts
var import_mongoose = require("mongoose");
var schema = new import_mongoose.Schema({
  archivedAt: Date,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["ACTIVE", "PENDING", "BLOCKED"],
    default: "ACTIVE"
  }
}, { timestamps: true });
var Admins = (0, import_mongoose.model)("Admins", schema);

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
var AuthenticationError = class extends DefaultError {
  constructor(params = {}) {
    super("Request unauthorized.", {
      description: {
        "en": "The request requires user authentication or the authentication has failed.",
        "pt-br": "A solicita\xE7\xE3o requer autentica\xE7\xE3o do usu\xE1rio ou a autentica\xE7\xE3o falhou."
      },
      level: "warning",
      status: params.status || 401,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "A solicita\xE7\xE3o requer autentica\xE7\xE3o do usu\xE1rio ou a autentica\xE7\xE3o falhou."
      }
    });
  }
};
var AuthorizationError = class extends DefaultError {
  constructor(params = {}) {
    super("Action execution refused due to a permissions violation.", {
      description: {
        "en": "The server understood the request, but refuses to authorize it.",
        "pt-br": "O servidor entendeu a solicita\xE7\xE3o, mas se recusa a autoriz\xE1-la."
      },
      status: params.status || 403,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "A solicita\xE7\xE3o chegou, mas n\xE3o foi autorizada."
      }
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
var decodeToken = (token) => import_jsonwebtoken.default.verify(token, env.SECRET_AUTH);

// src/repositories/mongo/mongo-admins-repository.ts
var MongoAdminsRepository = class {
  async getByEmail(email) {
    try {
      const admin = await Admins.findOne({ email });
      return admin;
    } catch (e) {
      throw new DatabaseError({ data: { email } });
    }
  }
  async getById(_id) {
    try {
      const admin = await Admins.findOne({ _id });
      return admin;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }
};

// src/utils/generate-token.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var generateToken = (data) => import_jsonwebtoken2.default.sign(data, env.SECRET_AUTH, { expiresIn: env.EXPIRE_AUTH });

// src/use-cases/auth/create-session.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var CreateSessionUseCase = class {
  constructor(adminsRepository) {
    this.adminsRepository = adminsRepository;
  }
  async execute({ email, password }) {
    const admin = await this.adminsRepository.getByEmail(email);
    if (!admin) {
      throw new ResourceNotFoundError({ data: { email }, UIDescription: { "pt-br": "Esse e-mail n\xE3o est\xE1 vinculado a um usu\xE1rio!" } });
    }
    if (admin.status != "ACTIVE") {
      throw new AuthorizationError({ data: { ...admin }, "UIDescription": { "pt-br": "Seu acesso foi bloqueado!" } });
    }
    const isPasswordCorrect = await import_bcrypt.default.compare(password, admin.password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError({ data: { ...admin }, "UIDescription": { "pt-br": "Senha incorreta!" } });
    }
    const token = generateToken({ _id: admin._id });
    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token
    };
  }
};

// src/use-cases/auth/verify-session.ts
var VerifySessionUseCase = class {
  constructor(adminsRepository) {
    this.adminsRepository = adminsRepository;
  }
  async execute({ token }) {
    if (!token) {
      throw new AuthenticationError();
    }
    const decode = decodeToken(token);
    if (!decode._id) {
      throw new AuthenticationError({ data: { token }, "UIDescription": { "pt-br": "Seu acesso expirou, fa\xE7a login novamente!" } });
    }
    const admin = await this.adminsRepository.getById(decode._id);
    if (!admin) {
      throw new ResourceNotFoundError({ data: { _id: decode._id }, UIDescription: { "pt-br": "Seu usu\xE1rio n\xE3o foi encontrado!" } });
    }
    if (admin.status != "ACTIVE") {
      throw new AuthenticationError({ data: { ...admin }, "UIDescription": { "pt-br": "Seu acesso foi bloqueado!" } });
    }
    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken({ _id: admin._id })
    };
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

// src/http/controllers/auth/create-session.ts
var import_zod2 = require("zod");
var schema3 = import_zod2.z.object({
  email: import_zod2.z.string().email().nonempty(),
  password: import_zod2.z.string().nonempty()
});
async function createSession(request, response, next) {
  try {
    const adminsRepository = new MongoAdminsRepository();
    if (request.body.token) {
      const verifySessionUseCase = new VerifySessionUseCase(adminsRepository);
      const data2 = await verifySessionUseCase.execute({ token: request.body.token });
      return response.status(200).json(data2);
    }
    const validator = new Validator(schema3);
    validator.parse(request.body);
    const createSessionUseCase = new CreateSessionUseCase(adminsRepository);
    const data = await createSessionUseCase.execute(request.body);
    response.status(200).json(data);
  } catch (e) {
    next(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSession
});
