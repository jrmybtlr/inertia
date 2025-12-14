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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => inertiaAstro,
  getInertiaConfig: () => getInertiaConfig
});
module.exports = __toCommonJS(index_exports);
function inertiaAstro(options) {
  const config = {
    framework: options.framework,
    laravelUrl: options.laravelUrl || "",
    includeCredentials: options.includeCredentials ?? true,
    progress: options.progress
  };
  return {
    name: "@inertiajs/astro",
    hooks: {
      "astro:config:setup": ({ injectScript, updateConfig }) => {
        injectScript(
          "page",
          `window.__INERTIA_ASTRO_CONFIG__ = ${JSON.stringify(config)};`
        );
        updateConfig({
          vite: {
            resolve: {
              dedupe: ["vue", "@inertiajs/vue3", "@inertiajs/react", "@inertiajs/svelte", "@inertiajs/core"]
            }
          }
        });
      }
    }
  };
}
function getInertiaConfig() {
  if (typeof window !== "undefined") {
    return window.__INERTIA_ASTRO_CONFIG__;
  }
  return void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getInertiaConfig
});
//# sourceMappingURL=index.js.map
