"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/models/admin.ts
var admin_exports = {};
__export(admin_exports, {
  Admins: () => Admins,
  schema: () => schema
});
module.exports = __toCommonJS(admin_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Admins,
  schema
});
