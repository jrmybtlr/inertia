// src/index.ts
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
export {
  inertiaAstro as default,
  getInertiaConfig
};
//# sourceMappingURL=index.esm.js.map
