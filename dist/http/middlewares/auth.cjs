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

// src/http/middlewares/auth.ts
var auth_exports = {};
__export(auth_exports, {
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);

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
var UnknownError = class extends DefaultError {
  constructor(params = {}) {
    const data = {
      description: {
        "en": "An unexpected error occurred while processing your request. Please try again later or contact our support team for assistance.",
        "pt-br": "Um erro inesperado ocorreu enquanto seu pedido era processado. Por favor, tente novamente mais tarde ou entre em contato com o suporte."
      },
      status: 500,
      level: "emergency",
      UIDescription: {
        "pt-br": "Um imprevisto ocorreu."
      }
    };
    if (params.path)
      data.path = params.path;
    super("Internal Server Error", data);
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

// src/http/middlewares/error-handling.ts
var error_handling_default = async (e, request, response, next) => {
  const error = e instanceof DefaultError ? e : new UnknownError(e instanceof Error ? { path: e.stack } : {});
  const message = {
    error: error.message,
    status: error.status
  };
  if (error.description["en"]) {
    message.message = error.description["en"];
  }
  if (error?.details?.length) {
    message.details = error.details;
  }
  if (request.get("ui-description")) {
    const LANGUAGES = ["en", "pt-br"];
    if (LANGUAGES.includes(String(request.headers["ui-language"]))) {
      message.UIDescription = error.UIDescription[String(request.headers["ui-language"])];
    }
  }
  return response.status(error.status || 400).json(message);
};

// src/utils/generate-token.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var generateToken = (data) => import_jsonwebtoken2.default.sign(data, env.SECRET_AUTH, { expiresIn: env.EXPIRE_AUTH });

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

// src/models/admin.ts
var import_mongoose2 = require("mongoose");
var schema2 = new import_mongoose2.Schema({
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
var Admins = (0, import_mongoose2.model)("Admins", schema2);

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

// src/http/middlewares/auth.ts
var auth_default = async (request, response, next) => {
  try {
    const adminsRepository = new MongoAdminsRepository();
    const verifySessionUseCase = new VerifySessionUseCase(adminsRepository);
    await verifySessionUseCase.execute({ token: request.headers.token });
    next();
  } catch (e) {
    error_handling_default(e, request, response, next);
  }
};
