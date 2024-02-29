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

// src/utils/errors.ts
var errors_exports = {};
__export(errors_exports, {
  AuthenticationError: () => AuthenticationError,
  AuthorizationError: () => AuthorizationError,
  DatabaseError: () => DatabaseError,
  DefaultError: () => DefaultError,
  DuplicateConflictError: () => DuplicateConflictError,
  InvalidCredentialsError: () => InvalidCredentialsError,
  ResourceExpiredError: () => ResourceExpiredError,
  ResourceNotFoundError: () => ResourceNotFoundError,
  ResourceUnavailableError: () => ResourceUnavailableError,
  UnknownError: () => UnknownError,
  ValidationError: () => ValidationError
});
module.exports = __toCommonJS(errors_exports);

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
var ResourceExpiredError = class extends DefaultError {
  constructor(params = {}) {
    super("Resource expired.", {
      description: {
        "en": "The server may have found the requested resource. But refuses to execute it because it expired.",
        "pt-br": "O servidor pode ter encontrado o recurso requisitado. Mas se recusa a executa-lo pois expirou."
      },
      level: "notice",
      status: params.status || 410,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "O recurso solicitado j\xE1 expirou."
      }
    });
  }
};
var InvalidCredentialsError = class extends DefaultError {
  constructor(params = {}) {
    super("Invalid Credentials.", {
      description: {
        "en": "The provided credentials are invalid or missing.",
        "pt-br": "As credenciais fornecidas s\xE3o inv\xE1lidas ou est\xE3o faltando."
      },
      level: "warning",
      status: params.status || 401,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "Credenciais inv\xE1lidas ou faltantes"
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
var ResourceUnavailableError = class extends DefaultError {
  constructor(params = {}) {
    super("Resource is currently unavailable.", {
      description: params.description ? params.description : {
        "en": "The resource you are trying to access is currently unavailable.",
        "pt-br": "O recurso que voc\xEA est\xE1 tentando acessar n\xE3o est\xE1 dispon\xEDvel no momento."
      },
      level: "info",
      status: params.status || 422,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        "pt-br": "Recurso n\xE3o dispon\xEDvel no momento."
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
  DefaultError,
  DuplicateConflictError,
  InvalidCredentialsError,
  ResourceExpiredError,
  ResourceNotFoundError,
  ResourceUnavailableError,
  UnknownError,
  ValidationError
});
