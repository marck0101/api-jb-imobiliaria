"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
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

// src/models/admin.ts
var import_mongoose, schema, Admins;
var init_admin = __esm({
  "src/models/admin.ts"() {
    "use strict";
    import_mongoose = require("mongoose");
    schema = new import_mongoose.Schema({
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
    Admins = (0, import_mongoose.model)("Admins", schema);
  }
});

// src/start.ts
var start_exports = {};
var import_bcrypt, import_cluster;
var init_start = __esm({
  "src/start.ts"() {
    "use strict";
    init_admin();
    import_bcrypt = __toESM(require("bcrypt"), 1);
    import_cluster = __toESM(require("cluster"), 1);
    if (import_cluster.default.isPrimary) {
      (async () => {
      })();
      (async () => {
        const admin = await Admins.findOne({ email: "admin@gmail.com" });
        if (admin)
          return;
        const salt = await import_bcrypt.default.genSalt(12);
        const password = await import_bcrypt.default.hash("123456", salt);
        await new Admins({ name: "Admin", email: "admin@gmail.com", password }).save();
      })();
    }
  }
});

// src/models/cteos.ts
var import_mongoose2, schema2, Cteos;
var init_cteos = __esm({
  "src/models/cteos.ts"() {
    "use strict";
    import_mongoose2 = require("mongoose");
    schema2 = new import_mongoose2.Schema({
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
    Cteos = (0, import_mongoose2.model)("Cteos", schema2);
  }
});

// src/utils/sleep.ts
var init_sleep = __esm({
  "src/utils/sleep.ts"() {
    "use strict";
  }
});

// src/models/logs.ts
var import_mongoose3, schema3, Logs;
var init_logs = __esm({
  "src/models/logs.ts"() {
    "use strict";
    import_mongoose3 = require("mongoose");
    schema3 = new import_mongoose3.Schema({
      level: String,
      message: String,
      data: Object,
      path: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }, { timestamps: true });
    Logs = (0, import_mongoose3.model)("Logs", schema3);
  }
});

// src/utils/logger.ts
var import_winston, LOGS_LEVELS, MongoTransport, logger, COLORS, custom;
var init_logger = __esm({
  "src/utils/logger.ts"() {
    "use strict";
    init_logs();
    import_winston = __toESM(require("winston"), 1);
    LOGS_LEVELS = {
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
    MongoTransport = class extends import_winston.default.Transport {
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
    logger = import_winston.default.createLogger({
      levels: LOGS_LEVELS,
      format: import_winston.format.combine(
        import_winston.format.json()
      ),
      transports: [
        new MongoTransport()
      ]
    });
    COLORS = {
      emergency: "\x1B[41m",
      alert: "\x1B[43m",
      critical: "\x1B[41m",
      error: "\x1B[41m",
      warning: "\x1B[43m",
      notice: "\x1B[43m",
      info: "\x1B[46m",
      debug: "\x1B[45m"
    };
    custom = import_winston.format.printf((data) => {
      const message = `${COLORS[data.level]} ${data.level.toUpperCase()} \x1B[0m ${data.message}`;
      return !data.data ? message : message + `
${JSON.stringify(data)}`;
    });
    if (process.env.BUILD !== "prod") {
      logger.add(new import_winston.transports.Console({ format: import_winston.format.combine(custom), level: "debug" }));
    }
  }
});

// src/utils/errors.ts
var DefaultError, UnknownError, DuplicateConflictError, ResourceNotFoundError, ValidationError, AuthenticationError, AuthorizationError, DatabaseError;
var init_errors = __esm({
  "src/utils/errors.ts"() {
    "use strict";
    init_logger();
    DefaultError = class extends Error {
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
    UnknownError = class extends DefaultError {
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
    DuplicateConflictError = class extends DefaultError {
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
    ResourceNotFoundError = class extends DefaultError {
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
    ValidationError = class extends DefaultError {
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
    AuthenticationError = class extends DefaultError {
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
    AuthorizationError = class extends DefaultError {
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
    DatabaseError = class extends DefaultError {
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
  }
});

// src/utils/get-random-int.ts
var init_get_random_int = __esm({
  "src/utils/get-random-int.ts"() {
    "use strict";
  }
});

// src/config/env.ts
var import_dotenv, import_path, import_zod, DEFAULT_PORT, envSchema, _env, env;
var init_env = __esm({
  "src/config/env.ts"() {
    "use strict";
    import_dotenv = __toESM(require("dotenv"), 1);
    import_path = __toESM(require("path"), 1);
    import_zod = require("zod");
    import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
    console.log(`=> API running with ${process.env.NODE_ENV?.toUpperCase() || "DEV"} environment!`);
    console.log("======================================");
    DEFAULT_PORT = 7e3;
    envSchema = import_zod.z.object({
      NODE_ENV: import_zod.z.string().default("dev"),
      PORT: import_zod.z.coerce.number().default(DEFAULT_PORT),
      DB_NAME: import_zod.z.string().default("vdr"),
      DB_URL: import_zod.z.string().default("mongodb://localhost:27017"),
      REDIS_URL: import_zod.z.string().default("127.0.0.1"),
      SECRET_AUTH: import_zod.z.string().default("1GH23jduihsSqFi6oedpniUask29OGpwmnSugGwziviIvoVNB3BF3daw5"),
      EXPIRE_AUTH: import_zod.z.string().default("1d"),
      FOCUS_NFE_BASE_URL: import_zod.z.string().default("https://homologacao.focusnfe.com.br/v2"),
      FOCUS_NFE_TOKEN: import_zod.z.string().default("hb5mYGx64HAZEEqVkku1aE0jJ2SUg4YG"),
      API_URL: import_zod.z.string().default(`http://localhost:${DEFAULT_PORT}`)
    });
    _env = envSchema.safeParse(process.env);
    if (!_env.success) {
      console.error("\u274C Invalid environment variables", _env.error.format());
      throw new Error("Invalid environment varibles.");
    }
    env = _env.data;
    console.log(env);
  }
});

// src/utils/decode-token.ts
var import_jsonwebtoken, decodeToken;
var init_decode_token = __esm({
  "src/utils/decode-token.ts"() {
    "use strict";
    init_env();
    import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
    decodeToken = (token) => import_jsonwebtoken.default.verify(token, env.SECRET_AUTH);
  }
});

// src/utils/index.ts
var init_utils = __esm({
  "src/utils/index.ts"() {
    "use strict";
    init_sleep();
    init_errors();
    init_logger();
    init_get_random_int();
    init_decode_token();
  }
});

// src/repositories/mongo/mongo-cteos-repository.ts
var MongoCteosRepository;
var init_mongo_cteos_repository = __esm({
  "src/repositories/mongo/mongo-cteos-repository.ts"() {
    "use strict";
    init_cteos();
    init_utils();
    MongoCteosRepository = class {
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
  }
});

// src/use-cases/cteos/update-cteos.ts
var import_axios, UpdateCteosUseCase;
var init_update_cteos = __esm({
  "src/use-cases/cteos/update-cteos.ts"() {
    "use strict";
    init_env();
    import_axios = __toESM(require("axios"), 1);
    UpdateCteosUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(data) {
        const response = await import_axios.default.get(`${env.FOCUS_NFE_BASE_URL}/cte/${data.ref}?completa=1&token=${env.FOCUS_NFE_TOKEN}`);
        await this.repository.update({ ref: data.ref }, { ...response.data });
      }
    };
  }
});

// src/cron.ts
var cron_exports = {};
var import_cluster2, import_node_cron;
var init_cron = __esm({
  "src/cron.ts"() {
    "use strict";
    import_cluster2 = __toESM(require("cluster"), 1);
    import_node_cron = __toESM(require("node-cron"), 1);
    init_cteos();
    init_mongo_cteos_repository();
    init_update_cteos();
    if (import_cluster2.default.isPrimary) {
      setTimeout(() => {
        console.log("\u2705 Cron is running!");
        import_node_cron.default.schedule("0 0 * * *", async () => {
          const cteos = await Cteos.find({}, { ref: true });
          const cteosRepository = new MongoCteosRepository();
          const updateCteosUseCase = new UpdateCteosUseCase(cteosRepository);
          for (const c of cteos) {
            await new Promise((r) => setTimeout(r, 1e3));
            try {
              await updateCteosUseCase.execute({ ref: c.ref });
            } catch (e) {
            }
          }
        });
        import_node_cron.default.schedule("0 8,12,16,20 * * *", async () => {
          const cteos = await Cteos.find({ $or: [{ status: "processando_autorizacao" }] }, { ref: true });
          const cteosRepository = new MongoCteosRepository();
          const updateCteosUseCase = new UpdateCteosUseCase(cteosRepository);
          for (const c of cteos) {
            await new Promise((r) => setTimeout(r, 1e3));
            try {
              await updateCteosUseCase.execute({ ref: c.ref });
            } catch (e) {
            }
          }
        });
      }, 5e3);
    }
  }
});

// src/repositories/mongo/mongo-admins-repository.ts
var MongoAdminsRepository;
var init_mongo_admins_repository = __esm({
  "src/repositories/mongo/mongo-admins-repository.ts"() {
    "use strict";
    init_admin();
    init_utils();
    MongoAdminsRepository = class {
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
  }
});

// src/utils/generate-token.ts
var import_jsonwebtoken2, generateToken;
var init_generate_token = __esm({
  "src/utils/generate-token.ts"() {
    "use strict";
    init_env();
    import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
    generateToken = (data) => import_jsonwebtoken2.default.sign(data, env.SECRET_AUTH, { expiresIn: env.EXPIRE_AUTH });
  }
});

// src/use-cases/auth/create-session.ts
var import_bcrypt2, CreateSessionUseCase;
var init_create_session = __esm({
  "src/use-cases/auth/create-session.ts"() {
    "use strict";
    init_utils();
    init_generate_token();
    import_bcrypt2 = __toESM(require("bcrypt"), 1);
    CreateSessionUseCase = class {
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
        const isPasswordCorrect = await import_bcrypt2.default.compare(password, admin.password);
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
  }
});

// src/use-cases/auth/verify-session.ts
var VerifySessionUseCase;
var init_verify_session = __esm({
  "src/use-cases/auth/verify-session.ts"() {
    "use strict";
    init_utils();
    init_generate_token();
    init_decode_token();
    init_utils();
    VerifySessionUseCase = class {
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
  }
});

// src/utils/validator.ts
var Validator;
var init_validator = __esm({
  "src/utils/validator.ts"() {
    "use strict";
    init_errors();
    Validator = class {
      constructor(schema15) {
        if (!schema15) {
          throw new Error("schema must be provided in construct of Validator class");
        }
        this.schema = schema15;
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
  }
});

// src/http/controllers/auth/create-session.ts
async function createSession(request, response, next) {
  try {
    const adminsRepository = new MongoAdminsRepository();
    if (request.body.token) {
      const verifySessionUseCase = new VerifySessionUseCase(adminsRepository);
      const data2 = await verifySessionUseCase.execute({ token: request.body.token });
      return response.status(200).json(data2);
    }
    const validator = new Validator(schema4);
    validator.parse(request.body);
    const createSessionUseCase = new CreateSessionUseCase(adminsRepository);
    const data = await createSessionUseCase.execute(request.body);
    response.status(200).json(data);
  } catch (e) {
    next(e);
  }
}
var import_zod2, schema4;
var init_create_session2 = __esm({
  "src/http/controllers/auth/create-session.ts"() {
    "use strict";
    init_mongo_admins_repository();
    init_create_session();
    init_verify_session();
    init_validator();
    import_zod2 = require("zod");
    schema4 = import_zod2.z.object({
      email: import_zod2.z.string().email().nonempty(),
      password: import_zod2.z.string().nonempty()
    });
  }
});

// src/use-cases/ceps/get-cep.ts
var import_axios2, GetCepUseCase;
var init_get_cep = __esm({
  "src/use-cases/ceps/get-cep.ts"() {
    "use strict";
    init_env();
    import_axios2 = __toESM(require("axios"), 1);
    GetCepUseCase = class {
      async execute({ cep }) {
        const url = `${env.FOCUS_NFE_BASE_URL}/ceps/${cep}?token=${env.FOCUS_NFE_TOKEN}`;
        const { data, status } = await import_axios2.default.get(url, { validateStatus: () => true });
        return { data, status };
      }
    };
  }
});

// src/http/controllers/ceps/get-cep.ts
async function getCep(request, response, next) {
  try {
    const getCepUseCase = new GetCepUseCase();
    const { data, status } = await getCepUseCase.execute({ cep: request.params.cep });
    return response.status(status || 200).json(data);
  } catch (e) {
    next(e);
  }
}
var init_get_cep2 = __esm({
  "src/http/controllers/ceps/get-cep.ts"() {
    "use strict";
    init_get_cep();
  }
});

// src/use-cases/cfops/get-cfop.ts
var import_axios3, GetCfopUseCase;
var init_get_cfop = __esm({
  "src/use-cases/cfops/get-cfop.ts"() {
    "use strict";
    init_env();
    import_axios3 = __toESM(require("axios"), 1);
    GetCfopUseCase = class {
      async execute({ cfop }) {
        const url = `${env.FOCUS_NFE_BASE_URL}/cfops/${cfop}?token=${env.FOCUS_NFE_TOKEN}`;
        const { data, status } = await import_axios3.default.get(url, { validateStatus: () => true });
        return { data, status };
      }
    };
  }
});

// src/http/controllers/cfops/get-cfop.ts
async function getCfop(request, response, next) {
  try {
    const getCfopUseCase = new GetCfopUseCase();
    const { data, status } = await getCfopUseCase.execute({ cfop: request.params.cfop });
    return response.status(status || 200).json(data);
  } catch (e) {
    next(e);
  }
}
var init_get_cfop2 = __esm({
  "src/http/controllers/cfops/get-cfop.ts"() {
    "use strict";
    init_get_cfop();
  }
});

// src/use-cases/cnpjs/get-cnpj.ts
var import_axios4, GetCnpjUseCase;
var init_get_cnpj = __esm({
  "src/use-cases/cnpjs/get-cnpj.ts"() {
    "use strict";
    import_axios4 = __toESM(require("axios"), 1);
    GetCnpjUseCase = class {
      async execute({ cnpj }) {
        const url = ` https://3S6IOjm4PAM4Tpvf8Typcva4IjxZieTB@api.focusnfe.com.br/v2/cnpjs/${cnpj}`;
        const { data, status } = await import_axios4.default.get(url, { validateStatus: () => true });
        return { data, status };
      }
    };
  }
});

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
var init_get_cnpj2 = __esm({
  "src/http/controllers/cnpjs/get-cnpj.ts"() {
    "use strict";
    init_get_cnpj();
  }
});

// src/models/vehicle.ts
var import_mongoose4, schema5, Vehicles;
var init_vehicle = __esm({
  "src/models/vehicle.ts"() {
    "use strict";
    import_mongoose4 = require("mongoose");
    schema5 = new import_mongoose4.Schema({
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
    Vehicles = (0, import_mongoose4.model)("Vehicles", schema5);
  }
});

// src/repositories/mongo/mongo-vehicles-repository.ts
var MongoVehiclesRepository;
var init_mongo_vehicles_repository = __esm({
  "src/repositories/mongo/mongo-vehicles-repository.ts"() {
    "use strict";
    init_vehicle();
    init_utils();
    MongoVehiclesRepository = class {
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
  }
});

// src/use-cases/vehicles/get-vehicle.ts
var GetVehicleUseCase;
var init_get_vehicle = __esm({
  "src/use-cases/vehicles/get-vehicle.ts"() {
    "use strict";
    init_utils();
    GetVehicleUseCase = class {
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
  }
});

// src/use-cases/cteos/create-cteos.ts
var import_axios5, import_crypto, DEFAULT, CreateCteosUseCase;
var init_create_cteos = __esm({
  "src/use-cases/cteos/create-cteos.ts"() {
    "use strict";
    init_env();
    import_axios5 = __toESM(require("axios"), 1);
    import_crypto = require("crypto");
    init_get_vehicle();
    DEFAULT = {
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
    CreateCteosUseCase = class {
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
        const ref2 = (0, import_crypto.randomUUID)();
        console.log("------ REQUEST ----------");
        console.log(request);
        console.log(`${env.FOCUS_NFE_BASE_URL}/cte_os?ref=${ref2}&token=${env.FOCUS_NFE_TOKEN}`);
        const response = await import_axios5.default.post(`${env.FOCUS_NFE_BASE_URL}/cte_os?ref=${ref2}&token=${env.FOCUS_NFE_TOKEN}`, request, { validateStatus: () => true });
        if (Number(response.data.status_sefaz) >= 400 || response.status >= 400) {
          return response;
        }
        let cteos = await this.cteosRepository.create({ ...response.data });
        try {
          const response2 = await import_axios5.default.get(`${env.FOCUS_NFE_BASE_URL}/cte/${ref2}?completa=1&token=${env.FOCUS_NFE_TOKEN}`);
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
  }
});

// src/http/controllers/cteos/create-cteos.ts
async function createCteos(request, response, next) {
  try {
    const validator = new Validator(schema6);
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
var import_zod3, schema6;
var init_create_cteos2 = __esm({
  "src/http/controllers/cteos/create-cteos.ts"() {
    "use strict";
    init_mongo_cteos_repository();
    init_mongo_vehicles_repository();
    init_create_cteos();
    init_validator();
    import_zod3 = require("zod");
    schema6 = import_zod3.z.object({
      cfop: import_zod3.z.string().nonempty(),
      bairro_tomador: import_zod3.z.string().nonempty(),
      logradouro_tomador: import_zod3.z.string().nonempty(),
      cep_tomador: import_zod3.z.string().nonempty(),
      codigo_municipio_tomador: import_zod3.z.string().nonempty(),
      municipio_tomador: import_zod3.z.string().nonempty(),
      uf_tomador: import_zod3.z.string().nonempty(),
      numero_tomador: import_zod3.z.string().nonempty(),
      cnpj_tomador: import_zod3.z.string().optional(),
      cpf_tomador: import_zod3.z.string().optional(),
      nome_fantasia_tomador: import_zod3.z.string().nonempty(),
      nome_tomador: import_zod3.z.string().nonempty(),
      codigo_municipio_fim: import_zod3.z.string().nonempty(),
      codigo_municipio_inicio: import_zod3.z.string().nonempty(),
      descricao_servico: import_zod3.z.string().nonempty(),
      indicador_inscricao_estadual_tomador: import_zod3.z.string().nonempty(),
      municipio_fim: import_zod3.z.string().nonempty(),
      municipio_inicio: import_zod3.z.string().nonempty(),
      natureza_operacao: import_zod3.z.string().nonempty(),
      tipo_servico: import_zod3.z.enum(["6", "7", "8"]),
      uf_fim: import_zod3.z.string().nonempty(),
      uf_inicio: import_zod3.z.string().nonempty(),
      valor_receber: import_zod3.z.number().min(0),
      valor_total: import_zod3.z.number().min(0),
      modal_rodoviario: import_zod3.z.string().nonempty(),
      percursos: import_zod3.z.array(import_zod3.z.unknown()).optional()
    });
  }
});

// src/use-cases/cteos/cancel-cteos.ts
var import_axios6, CancelCteosUseCase;
var init_cancel_cteos = __esm({
  "src/use-cases/cteos/cancel-cteos.ts"() {
    "use strict";
    init_env();
    init_mongo_cteos_repository();
    import_axios6 = __toESM(require("axios"), 1);
    init_update_cteos();
    CancelCteosUseCase = class {
      async execute({ ref: ref2, justificativa }) {
        console.log(`${env.FOCUS_NFE_BASE_URL}/cte/${ref2}?token=${env.FOCUS_NFE_TOKEN}`, { justificativa });
        const response = await import_axios6.default.delete(`${env.FOCUS_NFE_BASE_URL}/cte/${ref2}?token=${env.FOCUS_NFE_TOKEN}`, {
          data: { justificativa },
          headers: {
            "Content-Type": "application/json"
          },
          validateStatus: () => true
        });
        if (response.status == 200) {
          const mongoCteosRepository = new MongoCteosRepository();
          const updateCteosUseCase = new UpdateCteosUseCase(mongoCteosRepository);
          await updateCteosUseCase.execute({ ref: ref2 });
        }
        return response;
      }
    };
  }
});

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
var init_delete_cteos = __esm({
  "src/http/controllers/cteos/delete-cteos.ts"() {
    "use strict";
    init_cancel_cteos();
    init_utils();
  }
});

// src/use-cases/cteos/fetch-cteos.ts
var FetchCteosUseCase;
var init_fetch_cteos = __esm({
  "src/use-cases/cteos/fetch-cteos.ts"() {
    "use strict";
    FetchCteosUseCase = class {
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
  }
});

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
var init_fetch_cteos2 = __esm({
  "src/http/controllers/cteos/fetch-cteos.ts"() {
    "use strict";
    init_mongo_cteos_repository();
    init_fetch_cteos();
  }
});

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
var init_update_cteos2 = __esm({
  "src/http/controllers/cteos/update-cteos.ts"() {
    "use strict";
    init_mongo_cteos_repository();
    init_update_cteos();
    init_utils();
  }
});

// src/http/controllers/cteos/index.ts
var init_cteos2 = __esm({
  "src/http/controllers/cteos/index.ts"() {
    "use strict";
    init_create_cteos2();
    init_delete_cteos();
    init_fetch_cteos2();
    init_update_cteos2();
  }
});

// src/use-cases/vehicles/create-vehicle.ts
var CreateVehicleUseCase;
var init_create_vehicle = __esm({
  "src/use-cases/vehicles/create-vehicle.ts"() {
    "use strict";
    CreateVehicleUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(data) {
        const vehicle = await this.repository.create(data);
        return vehicle;
      }
    };
  }
});

// src/http/controllers/vehicles/create-vehicle.ts
async function createVehicle(request, response, next) {
  try {
    const validator = new Validator(schema7);
    validator.parse(request.body);
    const vehiclesRepository = new MongoVehiclesRepository();
    const createVehicleUseCase = new CreateVehicleUseCase(vehiclesRepository);
    const data = await createVehicleUseCase.execute(request.body);
    response.status(200).json(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
}
var import_zod4, schema7;
var init_create_vehicle2 = __esm({
  "src/http/controllers/vehicles/create-vehicle.ts"() {
    "use strict";
    init_mongo_vehicles_repository();
    init_create_vehicle();
    init_validator();
    import_zod4 = require("zod");
    schema7 = import_zod4.z.object({
      type: import_zod4.z.enum(["1", "2"]),
      nre: import_zod4.z.string().nonempty(),
      renavam: import_zod4.z.string().nonempty(),
      licensePlate: import_zod4.z.string().nonempty(),
      uf: import_zod4.z.string().nonempty(),
      name: import_zod4.z.string().nonempty(),
      manufacturingYear: import_zod4.z.number().min(1950),
      modelYear: import_zod4.z.number().min(1950),
      //marca - modelo - versão
      mmv: import_zod4.z.string().nonempty(),
      taf: import_zod4.z.string().optional(),
      owner: import_zod4.z.object({
        cpf: import_zod4.z.string().optional(),
        cnpj: import_zod4.z.string().optional(),
        corporateName: import_zod4.z.string().nonempty(),
        ie: import_zod4.z.string().nonempty(),
        uf: import_zod4.z.string().nonempty(),
        type: import_zod4.z.enum(["0", "1", "2"]),
        taf: import_zod4.z.string().nonempty()
      })
    });
  }
});

// src/use-cases/vehicles/archive-vehicle.ts
var ArchiveVehicleUseCase;
var init_archive_vehicle = __esm({
  "src/use-cases/vehicles/archive-vehicle.ts"() {
    "use strict";
    ArchiveVehicleUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(_id) {
        await this.repository.archive(_id);
      }
    };
  }
});

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
var init_delete_vehicle = __esm({
  "src/http/controllers/vehicles/delete-vehicle.ts"() {
    "use strict";
    init_mongo_vehicles_repository();
    init_archive_vehicle();
    init_utils();
  }
});

// src/use-cases/vehicles/fetch-vehicles.ts
var FetchVehiclesUseCase;
var init_fetch_vehicles = __esm({
  "src/use-cases/vehicles/fetch-vehicles.ts"() {
    "use strict";
    FetchVehiclesUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute() {
        const vehicles = await this.repository.get({
          archivedAt: { $exists: false }
        });
        return vehicles;
      }
    };
  }
});

// src/http/controllers/vehicles/fetch-vehicles.ts
async function fetchVehicles(request, response, next) {
  try {
    const vehiclesRepository = new MongoVehiclesRepository();
    if (request.params.id) {
      const getVehicleUseCase = new GetVehicleUseCase(vehiclesRepository);
      const data2 = await getVehicleUseCase.execute(request.params.id);
      return response.status(200).json(data2);
    }
    const fetchVehiclesUseCase = new FetchVehiclesUseCase(vehiclesRepository);
    const data = await fetchVehiclesUseCase.execute();
    response.status(200).json({ data });
  } catch (e) {
    next(e);
  }
}
var init_fetch_vehicles2 = __esm({
  "src/http/controllers/vehicles/fetch-vehicles.ts"() {
    "use strict";
    init_mongo_vehicles_repository();
    init_fetch_vehicles();
    init_get_vehicle();
  }
});

// src/use-cases/vehicles/update-vehicle.ts
var UpdateVehicleUseCase;
var init_update_vehicle = __esm({
  "src/use-cases/vehicles/update-vehicle.ts"() {
    "use strict";
    UpdateVehicleUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(_id, data) {
        await this.repository.update(_id, data);
      }
    };
  }
});

// src/http/controllers/vehicles/update-vehicle.ts
async function updateVehicle(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError();
    }
    const validator = new Validator(schema8);
    validator.parse(request.body);
    const vehiclesRepository = new MongoVehiclesRepository();
    const updateVehicleUseCase = new UpdateVehicleUseCase(vehiclesRepository);
    await updateVehicleUseCase.execute(request.params.id, request.body);
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
var import_zod5, schema8;
var init_update_vehicle2 = __esm({
  "src/http/controllers/vehicles/update-vehicle.ts"() {
    "use strict";
    init_mongo_vehicles_repository();
    init_update_vehicle();
    init_utils();
    init_validator();
    import_zod5 = require("zod");
    schema8 = import_zod5.z.object({
      type: import_zod5.z.enum(["1", "2"]).optional(),
      taf: import_zod5.z.string().optional(),
      renavam: import_zod5.z.string().optional(),
      licensePlate: import_zod5.z.string().optional(),
      uf: import_zod5.z.string().optional(),
      owner: import_zod5.z.object({
        cpf: import_zod5.z.string().optional(),
        cnpj: import_zod5.z.string().optional(),
        corporateName: import_zod5.z.string().optional(),
        ie: import_zod5.z.string().optional(),
        uf: import_zod5.z.string().optional(),
        type: import_zod5.z.enum(["0", "1", "2"]).optional(),
        taf: import_zod5.z.string().optional()
      }),
      nre: import_zod5.z.string().optional(),
      name: import_zod5.z.string().optional(),
      manufacturingYear: import_zod5.z.number().min(1950).optional(),
      modelYear: import_zod5.z.number().min(1950).optional(),
      mmv: import_zod5.z.string().optional()
    });
  }
});

// src/http/controllers/vehicles/index.ts
var init_vehicles = __esm({
  "src/http/controllers/vehicles/index.ts"() {
    "use strict";
    init_create_vehicle2();
    init_delete_vehicle();
    init_fetch_vehicles2();
    init_update_vehicle2();
  }
});

// src/models/trip.ts
var import_mongoose5, schema9, Trips;
var init_trip = __esm({
  "src/models/trip.ts"() {
    "use strict";
    import_mongoose5 = require("mongoose");
    schema9 = new import_mongoose5.Schema({
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
    Trips = (0, import_mongoose5.model)("Trips", schema9);
  }
});

// src/repositories/mongo/mongo-trips-repository.ts
var MongoTripsRepository;
var init_mongo_trips_repository = __esm({
  "src/repositories/mongo/mongo-trips-repository.ts"() {
    "use strict";
    init_trip();
    init_utils();
    MongoTripsRepository = class {
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
  }
});

// src/use-cases/trips/create-trip.ts
var CreateTripUseCase;
var init_create_trip = __esm({
  "src/use-cases/trips/create-trip.ts"() {
    "use strict";
    CreateTripUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(data) {
        const trip = await this.repository.create(data);
        return trip;
      }
    };
  }
});

// src/http/controllers/trips/create-trip.ts
async function createTrip(request, response, next) {
  try {
    const validator = new Validator(schema10);
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
var import_zod6, addressSchema, schema10;
var init_create_trip2 = __esm({
  "src/http/controllers/trips/create-trip.ts"() {
    "use strict";
    init_mongo_trips_repository();
    init_create_trip();
    init_validator();
    import_zod6 = require("zod");
    addressSchema = import_zod6.z.object({
      postalCode: import_zod6.z.string().optional(),
      city: import_zod6.z.string().min(1),
      number: import_zod6.z.string().min(1),
      state: import_zod6.z.string().min(1),
      street: import_zod6.z.string().min(1),
      country: import_zod6.z.string().min(1)
    });
    schema10 = import_zod6.z.object({
      name: import_zod6.z.string().min(1),
      description: import_zod6.z.string().min(1),
      startAddress: addressSchema,
      endAddress: addressSchema,
      startDate: import_zod6.z.string(),
      // Aceita datas no formato ISO 8601
      endDate: import_zod6.z.string(),
      type: import_zod6.z.enum(["SCHEDULED", "CHARTER", "UNIVERSITY"]),
      vehicle: import_zod6.z.string().min(1),
      passengers: import_zod6.z.array(
        import_zod6.z.object({
          seat: import_zod6.z.string().optional(),
          customer: import_zod6.z.string().optional()
        })
      ).optional()
    });
  }
});

// src/use-cases/trips/archive-trip.ts
var ArchiveTripUseCase;
var init_archive_trip = __esm({
  "src/use-cases/trips/archive-trip.ts"() {
    "use strict";
    ArchiveTripUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(_id) {
        await this.repository.archive(_id);
      }
    };
  }
});

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
var init_delete_trip = __esm({
  "src/http/controllers/trips/delete-trip.ts"() {
    "use strict";
    init_mongo_trips_repository();
    init_archive_trip();
    init_utils();
  }
});

// src/use-cases/trips/fetch-trips.ts
var FetchTripsUseCase;
var init_fetch_trips = __esm({
  "src/use-cases/trips/fetch-trips.ts"() {
    "use strict";
    FetchTripsUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute() {
        const trips = await this.repository.get();
        return trips;
      }
    };
  }
});

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
var init_fetch_trips2 = __esm({
  "src/http/controllers/trips/fetch-trips.ts"() {
    "use strict";
    init_mongo_trips_repository();
    init_fetch_trips();
  }
});

// src/use-cases/trips/update-trip.ts
var UpdateTripUseCase;
var init_update_trip = __esm({
  "src/use-cases/trips/update-trip.ts"() {
    "use strict";
    UpdateTripUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(_id, data) {
        await this.repository.update(_id, data);
      }
    };
  }
});

// src/http/controllers/trips/update-trip.ts
async function updateTrip(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError({ description: { "en": "Trip _id must be provided" } });
    }
    const validator = new Validator(schema11);
    validator.parse(request.body);
    const tripsRepository = new MongoTripsRepository();
    const updateTripUseCase = new UpdateTripUseCase(tripsRepository);
    await updateTripUseCase.execute(request.params.id, request.body);
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
var import_zod7, addressSchema2, schema11;
var init_update_trip2 = __esm({
  "src/http/controllers/trips/update-trip.ts"() {
    "use strict";
    init_mongo_trips_repository();
    init_update_trip();
    init_utils();
    init_validator();
    import_zod7 = require("zod");
    addressSchema2 = import_zod7.z.object({
      postalCode: import_zod7.z.string().min(1),
      city: import_zod7.z.string().min(1),
      number: import_zod7.z.string().min(1),
      state: import_zod7.z.string().min(1),
      street: import_zod7.z.string().min(1),
      country: import_zod7.z.string().min(1)
    });
    schema11 = import_zod7.z.object({
      name: import_zod7.z.string().optional(),
      description: import_zod7.z.string().optional(),
      startAddress: addressSchema2.optional(),
      endAddress: addressSchema2.optional(),
      startDate: import_zod7.z.date().optional(),
      endDate: import_zod7.z.date().optional(),
      type: import_zod7.z.enum(["SCHEDULED", "CHARTER", "UNIVERSITY"]).optional(),
      vehicle: import_zod7.z.custom().optional(),
      passengers: import_zod7.z.array(import_zod7.z.object({
        customer: import_zod7.z.string().min(1),
        seat: import_zod7.z.string().min(1)
      })).optional()
    });
  }
});

// src/http/controllers/trips/index.ts
var init_trips = __esm({
  "src/http/controllers/trips/index.ts"() {
    "use strict";
    init_create_trip2();
    init_delete_trip();
    init_fetch_trips2();
    init_update_trip2();
  }
});

// src/models/customer.ts
var import_mongoose6, file, schema12, Customers;
var init_customer = __esm({
  "src/models/customer.ts"() {
    "use strict";
    import_mongoose6 = require("mongoose");
    file = new import_mongoose6.Schema({
      name: String,
      url: String,
      size: Number,
      type: String
    });
    schema12 = new import_mongoose6.Schema({
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
    Customers = (0, import_mongoose6.model)("Customers", schema12);
  }
});

// src/repositories/mongo/mongo-customers-repository.ts
var MongoCustumerRepository;
var init_mongo_customers_repository = __esm({
  "src/repositories/mongo/mongo-customers-repository.ts"() {
    "use strict";
    init_customer();
    init_utils();
    MongoCustumerRepository = class {
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
  }
});

// src/use-cases/customers/create-customers.ts
var CreateCustomerUseCase;
var init_create_customers = __esm({
  "src/use-cases/customers/create-customers.ts"() {
    "use strict";
    init_utils();
    CreateCustomerUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(data) {
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
        const customer = await this.repository.create(data);
        return customer;
      }
    };
  }
});

// src/http/controllers/customers/create-customer.ts
async function createCustomer(request, response, next) {
  try {
    const validator = new Validator(schema13);
    console.log("request.body", request.body);
    validator.parse(request.body);
    const customersRepository = new MongoCustumerRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customersRepository);
    const data = await createCustomerUseCase.execute(request.body);
    response.status(200).json(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
}
var import_zod8, schema13;
var init_create_customer = __esm({
  "src/http/controllers/customers/create-customer.ts"() {
    "use strict";
    init_mongo_customers_repository();
    init_create_customers();
    init_validator();
    import_zod8 = require("zod");
    schema13 = import_zod8.z.object({
      name: import_zod8.z.string().nonempty(),
      fantasyname: import_zod8.z.string().optional(),
      email: import_zod8.z.string().optional(),
      birthdate: import_zod8.z.string().optional(),
      cpf: import_zod8.z.string().optional(),
      cnpj: import_zod8.z.string().optional(),
      phone: import_zod8.z.string().optional(),
      rg: import_zod8.z.string().optional(),
      address: import_zod8.z.object({
        cep: import_zod8.z.string().optional(),
        city: import_zod8.z.string().optional(),
        number: import_zod8.z.string().optional(),
        state: import_zod8.z.string().optional(),
        street: import_zod8.z.string().optional(),
        bairro: import_zod8.z.string().optional()
      }).optional(),
      files: import_zod8.z.array(import_zod8.z.object({
        name: import_zod8.z.string().optional(),
        url: import_zod8.z.string().optional(),
        size: import_zod8.z.number().optional(),
        type: import_zod8.z.string().optional()
      })).optional()
    });
  }
});

// src/use-cases/customers/fetch-customers.ts
var FetchCustumersUseCase;
var init_fetch_customers = __esm({
  "src/use-cases/customers/fetch-customers.ts"() {
    "use strict";
    FetchCustumersUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute() {
        const customers = await this.repository.get({
          archivedAt: { $exists: false }
        });
        return customers;
      }
    };
  }
});

// src/use-cases/customers/get-customers.ts
var GetCustomersUseCase;
var init_get_customers = __esm({
  "src/use-cases/customers/get-customers.ts"() {
    "use strict";
    init_utils();
    GetCustomersUseCase = class {
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
  }
});

// src/http/controllers/customers/fetch-customers.ts
async function fetchCustomers(request, response, next) {
  try {
    const customersRepository = new MongoCustumerRepository();
    if (request.params.id) {
      const getCustomersUseCase = new GetCustomersUseCase(customersRepository);
      const data2 = await getCustomersUseCase.execute(request.params.id);
      return response.status(200).json(data2);
    }
    const fetchCustumersUseCase = new FetchCustumersUseCase(customersRepository);
    const data = await fetchCustumersUseCase.execute();
    response.status(200).json({ data });
  } catch (e) {
    next(e);
  }
}
var init_fetch_customers2 = __esm({
  "src/http/controllers/customers/fetch-customers.ts"() {
    "use strict";
    init_mongo_customers_repository();
    init_fetch_customers();
    init_get_customers();
  }
});

// src/use-cases/customers/update-customers.ts
var UpdateCustomersUseCase;
var init_update_customers = __esm({
  "src/use-cases/customers/update-customers.ts"() {
    "use strict";
    init_utils();
    UpdateCustomersUseCase = class {
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
  }
});

// src/http/controllers/customers/update-customers.ts
async function updateCustomer(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError();
    }
    const validator = new Validator(schema14);
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
var import_zod9, schema14;
var init_update_customers2 = __esm({
  "src/http/controllers/customers/update-customers.ts"() {
    "use strict";
    init_mongo_customers_repository();
    init_get_customers();
    init_update_customers();
    init_utils();
    init_validator();
    import_zod9 = require("zod");
    schema14 = import_zod9.z.object({
      name: import_zod9.z.string().optional(),
      fantasyname: import_zod9.z.string().optional(),
      email: import_zod9.z.string().optional(),
      birthdate: import_zod9.z.string().optional(),
      cpf: import_zod9.z.string().optional(),
      cnpj: import_zod9.z.string().optional(),
      phone: import_zod9.z.string().optional(),
      rg: import_zod9.z.string().optional(),
      address: import_zod9.z.object({
        cep: import_zod9.z.string().optional(),
        city: import_zod9.z.string().optional(),
        number: import_zod9.z.string().optional(),
        bairro: import_zod9.z.string().optional(),
        state: import_zod9.z.string().optional(),
        street: import_zod9.z.string().optional()
      }).optional(),
      files: import_zod9.z.array(import_zod9.z.object({
        name: import_zod9.z.string().optional(),
        url: import_zod9.z.string().optional(),
        size: import_zod9.z.number().optional(),
        type: import_zod9.z.string().optional()
      }).optional())
    });
  }
});

// src/use-cases/customers/archive-customers.ts
var ArchiveCustomerUseCase;
var init_archive_customers = __esm({
  "src/use-cases/customers/archive-customers.ts"() {
    "use strict";
    ArchiveCustomerUseCase = class {
      constructor(repository) {
        this.repository = repository;
      }
      async execute(_id) {
        await this.repository.archive(_id);
        console.log("cheguei aqui");
        console.log(_id);
      }
    };
  }
});

// src/http/controllers/customers/firebase.ts
var import_app, import_storage, firebaseConfig, app, storage;
var init_firebase = __esm({
  "src/http/controllers/customers/firebase.ts"() {
    "use strict";
    import_app = require("firebase/app");
    import_storage = require("firebase/storage");
    firebaseConfig = {
      apiKey: "AIzaSyDKppQY3GZuSj3eBkFSMQcQi5nl2FBNdGU",
      authDomain: "imagens-63ad7.firebaseapp.com",
      projectId: "imagens-63ad7",
      storageBucket: "imagens-63ad7.appspot.com",
      messagingSenderId: "346371836172",
      appId: "1:346371836172:web:0469f8c69df6b846196129",
      measurementId: "G-JBY3090JP9"
    };
    app = (0, import_app.initializeApp)(firebaseConfig);
    storage = (0, import_storage.getStorage)(app);
  }
});

// src/http/controllers/customers/delete-customer.ts
async function deleteCustomer(request, response, next) {
  try {
    if (!request.params.id) {
      throw new ValidationError();
    }
    const customerRepository = new MongoCustumerRepository();
    const archiveCustomerUseCase = new ArchiveCustomerUseCase(customerRepository);
    const getCustomerUseCase = new GetCustomersUseCase(customerRepository);
    await archiveCustomerUseCase.execute(request.params.id);
    const customer = await getCustomerUseCase.execute(request.params.id);
    console.log("customer", customer);
    customer.files.forEach(async (item) => {
      if (item.url) {
        try {
          const storageRef = (0, import_storage2.ref)(storage, item.url);
          await (0, import_storage2.deleteObject)(storageRef);
        } catch (error) {
          console.error("Erro ao deletar arquivo:", error);
        }
      } else {
        console.log("Nenhuma imagem para deletar.");
      }
    });
    response.status(200).json({ _id: request.params.id });
  } catch (e) {
    next(e);
  }
}
var import_storage2;
var init_delete_customer = __esm({
  "src/http/controllers/customers/delete-customer.ts"() {
    "use strict";
    init_mongo_customers_repository();
    init_archive_customers();
    init_get_customers();
    init_utils();
    import_storage2 = require("firebase/storage");
    init_firebase();
  }
});

// src/http/routes.ts
var import_express, routes;
var init_routes = __esm({
  "src/http/routes.ts"() {
    "use strict";
    import_express = require("express");
    init_create_session2();
    init_get_cep2();
    init_get_cfop2();
    init_get_cnpj2();
    init_cteos2();
    init_vehicles();
    init_trips();
    init_create_customer();
    init_fetch_customers2();
    init_update_customers2();
    init_delete_customer();
    routes = (0, import_express.Router)();
    routes.get(
      "/",
      async (request, response, next) => {
        response.status(200).json({ message: "Welcome to the VDR Petri API!!" });
        console.log(next);
      }
    );
    routes.post("/authenticate", createSession);
    routes.post("/vehicles", createVehicle);
    routes.get("/vehicles/:id*?", fetchVehicles);
    routes.delete("/vehicles/:id", deleteVehicle);
    routes.put("/vehicles/:id", updateVehicle);
    routes.post("/cteos", createCteos);
    routes.get("/cteos", fetchCteos);
    routes.post("/cteos/webhooks", updateCteos);
    routes.delete("/cteos/:id", deleteCteos);
    routes.get("/ceps/:cep", getCep);
    routes.get("/cfops/:cfop", getCfop);
    routes.get("/cfops/:cnpj", getCnpj);
    routes.get("/cnpjs/:cnpj", getCnpj);
    routes.post("/customers", createCustomer);
    routes.get("/customers/:id*?", fetchCustomers);
    routes.put("/customers/:id", updateCustomer);
    routes.delete("/customers/:id", deleteCustomer);
    routes.post("/trips", createTrip);
    routes.get("/trips/:id*?", fetchTrips);
    routes.put("/trips/:id", updateTrip);
    routes.delete("/trips/:id", deleteTrip);
  }
});

// src/http/middlewares/error-handling.ts
var error_handling_default;
var init_error_handling = __esm({
  "src/http/middlewares/error-handling.ts"() {
    "use strict";
    init_utils();
    error_handling_default = async (e, request, response, next) => {
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
  }
});

// src/app.ts
var import_dotenv2, import_path2, import_express2, import_cors, app2;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    import_dotenv2 = __toESM(require("dotenv"), 1);
    import_path2 = __toESM(require("path"), 1);
    import_express2 = __toESM(require("express"), 1);
    init_routes();
    import_cors = __toESM(require("cors"), 1);
    init_error_handling();
    import_dotenv2.default.config({ path: import_path2.default.resolve(process.cwd(), ".env.dev") });
    app2 = (0, import_express2.default)();
    app2.use(import_express2.default.json());
    app2.use(import_express2.default.urlencoded({ extended: true }));
    app2.use("/public", import_express2.default.static("src/assets"));
    app2.use((0, import_cors.default)({ origin: "*" }));
    app2.use(routes);
    app2.use(error_handling_default);
  }
});

// src/server.ts
var server_exports = {};
var import_mongoose7;
var init_server = __esm({
  "src/server.ts"() {
    "use strict";
    import_mongoose7 = __toESM(require("mongoose"), 1);
    init_app();
    init_env();
    init_start();
    init_cron();
    app2.listen(env.PORT, () => console.log(`\u2705 Server running at http://localhost:${env.PORT}`));
    import_mongoose7.default.connect(`${env.DB_URL}`, {
      dbName: env.DB_NAME,
      serverSelectionTimeoutMS: 2e3
    }).then(() => {
      console.log("\u2705 Mongoose connection was succesfully established!");
    }).catch(() => {
      console.log("\u274C Cannot connect mongoose!");
    });
  }
});

// src/cluster.ts
var import_cluster3 = __toESM(require("cluster"), 1);
var runPrimaryProcess = () => {
  Promise.resolve().then(() => init_start());
  Promise.resolve().then(() => init_cron());
  const processesCount = 4;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forkinng Server with ${processesCount} process`);
  for (let index = 0; index < processesCount; index++)
    import_cluster3.default.fork();
  import_cluster3.default.on("exit", (worker, code) => {
    if (code != 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} died... scheduling another one!`);
      import_cluster3.default.fork();
    }
  });
};
var runWorkerProcess = async () => {
  await Promise.resolve().then(() => (init_server(), server_exports));
};
import_cluster3.default.isPrimary ? runPrimaryProcess() : runWorkerProcess();
