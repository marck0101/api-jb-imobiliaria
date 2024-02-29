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

// src/http/controllers/customers/firebase.ts
var firebase_exports = {};
__export(firebase_exports, {
  app: () => app,
  storage: () => storage
});
module.exports = __toCommonJS(firebase_exports);
var import_app = require("firebase/app");
var import_storage = require("firebase/storage");
var firebaseConfig = {
  apiKey: "AIzaSyDKppQY3GZuSj3eBkFSMQcQi5nl2FBNdGU",
  authDomain: "imagens-63ad7.firebaseapp.com",
  projectId: "imagens-63ad7",
  storageBucket: "imagens-63ad7.appspot.com",
  messagingSenderId: "346371836172",
  appId: "1:346371836172:web:0469f8c69df6b846196129",
  measurementId: "G-JBY3090JP9"
};
var app = (0, import_app.initializeApp)(firebaseConfig);
var storage = (0, import_storage.getStorage)(app);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app,
  storage
});
