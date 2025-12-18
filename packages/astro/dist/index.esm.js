// src/resolvers.ts
function createResolver(options) {
  const { pages, extensions = [".vue"] } = options;
  return (name) => {
    const modes = ["client", "server", "default"];
    const baseDirs = ["./pages", "./Pages", "."];
    const attemptedPaths = [];
    for (const mode of modes) {
      for (const baseDir of baseDirs) {
        for (const ext of extensions) {
          const path = mode === "default" ? `${baseDir}/${name}${ext}` : `${baseDir}/${name}.${mode}${ext}`;
          attemptedPaths.push(path);
          if (pages[path]) {
            return pages[path];
          }
        }
      }
    }
    throw new Error(
      `Component "${name}" not found. Make sure to import it with the correct path. Tried: ${attemptedPaths.join(", ")}`
    );
  };
}
function createSimpleResolver(options) {
  const { pages, extension } = options;
  return (name) => {
    const clientPath = `./pages/${name}.client${extension}`;
    if (pages[clientPath]) {
      return pages[clientPath];
    }
    const serverPath = `./pages/${name}.server${extension}`;
    if (pages[serverPath]) {
      return pages[serverPath];
    }
    const defaultPath = `./pages/${name}${extension}`;
    if (pages[defaultPath]) {
      return pages[defaultPath];
    }
    const capitalClientPath = `./Pages/${name}.client${extension}`;
    if (pages[capitalClientPath]) {
      return pages[capitalClientPath];
    }
    const capitalServerPath = `./Pages/${name}.server${extension}`;
    if (pages[capitalServerPath]) {
      return pages[capitalServerPath];
    }
    const capitalDefaultPath = `./Pages/${name}${extension}`;
    if (pages[capitalDefaultPath]) {
      return pages[capitalDefaultPath];
    }
    throw new Error(`Component "${name}" not found`);
  };
}

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
        injectScript("page", `window.__INERTIA_ASTRO_CONFIG__ = ${JSON.stringify(config)};`);
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
  createResolver,
  createSimpleResolver,
  inertiaAstro as default,
  getInertiaConfig
};
//# sourceMappingURL=index.esm.js.map
