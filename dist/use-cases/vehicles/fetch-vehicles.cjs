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

// src/use-cases/vehicles/fetch-vehicles.ts
var fetch_vehicles_exports = {};
__export(fetch_vehicles_exports, {
  FetchVehiclesUseCase: () => FetchVehiclesUseCase
});
module.exports = __toCommonJS(fetch_vehicles_exports);
var FetchVehiclesUseCase = class {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchVehiclesUseCase
});
