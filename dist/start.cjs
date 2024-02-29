"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/start.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_cluster = __toESM(require("cluster"), 1);
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
