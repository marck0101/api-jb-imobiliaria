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

// src/http/controllers/vehicles/delete-vehicle.ts
var delete_vehicle_exports = {};
__export(delete_vehicle_exports, {
  deleteVehicle: () => deleteVehicle
});
module.exports = __toCommonJS(delete_vehicle_exports);

// src/models/vehicle.ts
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

// src/use-cases/vehicles/archive-vehicle.ts
var ArchiveVehicleUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(_id) {
    await this.repository.archive(_id);
  }
};

// src/http/controllers/vehicles/delete-vehicle.ts
async function deleteVehicle(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError();
    }
    const vehiclesRepository = new MongoVehiclesRepository();
    const archiveVehicleUseCase = new ArchiveVehicleUseCase(vehiclesRepository);
    await archiveVehicleUseCase.execute(request.params.id);
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteVehicle
});
