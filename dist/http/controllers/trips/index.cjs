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

// src/http/controllers/trips/index.ts
var trips_exports = {};
__export(trips_exports, {
  createTrip: () => createTrip,
  deleteTrip: () => deleteTrip,
  fetchTrips: () => fetchTrips,
  updateTrip: () => updateTrip
});
module.exports = __toCommonJS(trips_exports);

// src/models/trip.ts
var import_mongoose = require("mongoose");
var schema = new import_mongoose.Schema({
  name: String,
  description: String,
  startAddress: {
    postalCode: String,
    city: String,
    number: String,
    state: String,
    street: String,
    country: String
  },
  endAddress: {
    postalCode: String,
    city: String,
    number: String,
    state: String,
    street: String,
    country: String
  },
  startDate: Date,
  endDate: Date,
  type: {
    type: String,
    enum: ["SCHEDULED", "CHARTER", "UNIVERSITY"]
  },
  vehicle: String,
  passengers: [{
    customer: String,
    seat: String
  }],
  archivedAt: Date
}, { timestamps: true });
var Trips = (0, import_mongoose.model)("Trips", schema);

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

// src/repositories/mongo/mongo-trips-repository.ts
var MongoTripsRepository = class {
  async create(data) {
    try {
      const trip = new Trips(data);
      await trip.save();
      return trip;
    } catch (e) {
      throw new DatabaseError({ data });
    }
  }
  async update(_id, data) {
    try {
      const result = await Trips.updateOne({ _id }, data);
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id, ...data } });
    }
  }
  async archive(_id) {
    try {
      const result = await Trips.updateOne({ _id }, { archivedAt: /* @__PURE__ */ new Date() });
      return result;
    } catch (e) {
      throw new DatabaseError({ data: { _id } });
    }
  }
  async get() {
    try {
      const result = await Trips.find();
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
  async getById(_id) {
    try {
      const result = await Trips.findOne({ _id });
      return result;
    } catch (e) {
      throw new DatabaseError();
    }
  }
};

// src/use-cases/trips/create-trip.ts
var CreateTripUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    const trip = await this.repository.create(data);
    return trip;
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

// src/http/controllers/trips/create-trip.ts
var import_zod2 = require("zod");
var addressSchema = import_zod2.z.object({
  postalCode: import_zod2.z.string().optional(),
  city: import_zod2.z.string().min(1),
  number: import_zod2.z.string().min(1),
  state: import_zod2.z.string().min(1),
  street: import_zod2.z.string().min(1),
  country: import_zod2.z.string().min(1)
});
var schema3 = import_zod2.z.object({
  name: import_zod2.z.string().min(1),
  description: import_zod2.z.string().min(1),
  startAddress: addressSchema,
  endAddress: addressSchema,
  startDate: import_zod2.z.string(),
  // Aceita datas no formato ISO 8601
  endDate: import_zod2.z.string(),
  type: import_zod2.z.enum(["SCHEDULED", "CHARTER", "UNIVERSITY"]),
  vehicle: import_zod2.z.string().min(1),
  passengers: import_zod2.z.array(
    import_zod2.z.object({
      seat: import_zod2.z.string().optional(),
      customer: import_zod2.z.string().optional()
    })
  ).optional()
});
async function createTrip(request, response, next) {
  try {
    const validator = new Validator(schema3);
    validator.parse(request.body);
    const tripsRepository = new MongoTripsRepository();
    const createTripUseCase = new CreateTripUseCase(tripsRepository);
    const data = await createTripUseCase.execute({
      ...request.body,
      startDate: new Date(request.body.startDate),
      endDate: new Date(request.body.endDate)
    });
    response.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

// src/use-cases/trips/archive-trip.ts
var ArchiveTripUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(_id) {
    await this.repository.archive(_id);
  }
};

// src/http/controllers/trips/delete-trip.ts
async function deleteTrip(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError({
        description: { en: "Trip _id must be provided" }
      });
    }
    const tripsRepository = new MongoTripsRepository();
    const archiveTripUseCase = new ArchiveTripUseCase(tripsRepository);
    console.log(`Excluindo viagem com ID: ${request.params.id}`);
    await archiveTripUseCase.execute(request.params.id);
    console.log(`Viagem com ID ${request.params.id} exclu\xEDda com sucesso.`);
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}

// src/use-cases/trips/fetch-trips.ts
var FetchTripsUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    const trips = await this.repository.get();
    return trips;
  }
};

// src/http/controllers/trips/fetch-trips.ts
async function fetchTrips(request, response, next) {
  try {
    const tripsRepository = new MongoTripsRepository();
    const fetchTripsUseCase = new FetchTripsUseCase(tripsRepository);
    const data = await fetchTripsUseCase.execute();
    response.status(200).json({ data });
  } catch (e) {
    next(e);
  }
}

// src/use-cases/trips/update-trip.ts
var UpdateTripUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(_id, data) {
    await this.repository.update(_id, data);
  }
};

// src/http/controllers/trips/update-trip.ts
var import_zod3 = require("zod");
var addressSchema2 = import_zod3.z.object({
  postalCode: import_zod3.z.string().min(1),
  city: import_zod3.z.string().min(1),
  number: import_zod3.z.string().min(1),
  state: import_zod3.z.string().min(1),
  street: import_zod3.z.string().min(1),
  country: import_zod3.z.string().min(1)
});
var schema4 = import_zod3.z.object({
  name: import_zod3.z.string().optional(),
  description: import_zod3.z.string().optional(),
  startAddress: addressSchema2.optional(),
  endAddress: addressSchema2.optional(),
  startDate: import_zod3.z.date().optional(),
  endDate: import_zod3.z.date().optional(),
  type: import_zod3.z.enum(["SCHEDULED", "CHARTER", "UNIVERSITY"]).optional(),
  vehicle: import_zod3.z.custom().optional(),
  passengers: import_zod3.z.array(import_zod3.z.object({
    customer: import_zod3.z.string().min(1),
    seat: import_zod3.z.string().min(1)
  })).optional()
});
async function updateTrip(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError({ description: { "en": "Trip _id must be provided" } });
    }
    const validator = new Validator(schema4);
    validator.parse(request.body);
    const tripsRepository = new MongoTripsRepository();
    const updateTripUseCase = new UpdateTripUseCase(tripsRepository);
    await updateTripUseCase.execute(request.params.id, request.body);
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTrip,
  deleteTrip,
  fetchTrips,
  updateTrip
});
