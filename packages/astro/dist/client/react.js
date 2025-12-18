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

// src/client/react.ts
var react_exports = {};
__export(react_exports, {
  initInertia: () => initInertia,
  router: () => import_core2.router
});
module.exports = __toCommonJS(react_exports);
var import_core = require("@inertiajs/core");
var import_core2 = require("@inertiajs/core");
async function initInertia(options) {
  const config = window.__INERTIA_ASTRO_CONFIG__;
  const id = options.id || "app";
  const islandEl = document.getElementById(id);
  if (!islandEl) {
    console.warn(`[Inertia] Mount element #${id} not found`);
    return;
  }
  const laravelUrl = options.laravelUrl || config?.laravelUrl || "";
  const includeCredentials = options.includeCredentials ?? config?.includeCredentials ?? true;
  const progress = options.progress ?? config?.progress;
  let initialPage = options.initialPage;
  if (!initialPage) {
    initialPage = await fetchInitialPage(laravelUrl, includeCredentials) ?? void 0;
  }
  if (!initialPage) {
    console.error("[Inertia] Failed to fetch initial page data");
    return;
  }
  const [React, ReactDOM, inertiaReact] = await Promise.all([
    import("react"),
    import("react-dom/client"),
    import("@inertiajs/react")
  ]);
  const { App } = inertiaReact;
  const { createElement } = React;
  const { createRoot } = ReactDOM;
  const resolveComponent = createComponentResolver(options.resolve);
  const initialComponent = await resolveComponent(initialPage.component);
  islandEl.innerHTML = "";
  islandEl.setAttribute("data-inertia-mounted", "true");
  import_core.router.init({
    initialPage,
    resolveComponent,
    swapComponent: async ({ component, page, preserveState }) => {
    }
  });
  if (progress !== false) {
    (0, import_core.setupProgress)(progress || {});
  }
  const props = {
    initialPage,
    initialComponent,
    resolveComponent,
    titleCallback: options.title
  };
  const root = createRoot(islandEl);
  root.render(createElement(App, props));
  import_core.router.decryptHistory().catch(() => {
  });
}
async function fetchInitialPage(laravelUrl, includeCredentials) {
  try {
    const url = laravelUrl ? `${laravelUrl}${window.location.pathname}${window.location.search}` : `${window.location.pathname}${window.location.search}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-Inertia": "true",
        "X-Inertia-Version": ""
      },
      credentials: includeCredentials ? "include" : "same-origin"
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("Response is not JSON. Is Laravel returning an Inertia response?");
    }
    return await response.json();
  } catch (error) {
    console.error("[Inertia] Failed to fetch initial page:", error);
    return null;
  }
}
function createComponentResolver(resolve) {
  return async (name) => {
    const module2 = await Promise.resolve(resolve(name));
    if (module2 === null || module2 === void 0) {
      throw new Error(`Component "${name}" not found`);
    }
    if (typeof module2 === "object" && "default" in module2) {
      return module2.default;
    }
    return module2;
  };
}
//# sourceMappingURL=react.js.map
