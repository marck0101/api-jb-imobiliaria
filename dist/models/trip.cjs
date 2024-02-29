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

// src/models/trip.ts
var trip_exports = {};
__export(trip_exports, {
  Trips: () => Trips,
  schema: () => schema
});
module.exports = __toCommonJS(trip_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Trips,
  schema
});
