// src/client/svelte.ts
import { router, setupProgress } from "@inertiajs/core";
import { router as router2 } from "@inertiajs/core";

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

// src/client/svelte.ts
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
  const inertiaSvelte = await import("@inertiajs/svelte");
  const { App } = inertiaSvelte;
  const resolveComponent = createComponentResolver(options.resolve);
  const initialComponent = await resolveComponent(initialPage.component);
  islandEl.innerHTML = "";
  islandEl.setAttribute("data-inertia-mounted", "true");
  if (progress !== false) {
    setupProgress(progress || {});
  }
  const props = {
    initialPage,
    initialComponent,
    resolveComponent
  };
  try {
    const { mount } = await import("svelte");
    mount(App, {
      target: islandEl,
      props
    });
  } catch {
    new App({
      target: islandEl,
      props
    });
  }
  router.decryptHistory().catch(() => {
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
    const module = await Promise.resolve(resolve(name));
    if (module === null || module === void 0) {
      throw new Error(`Component "${name}" not found`);
    }
    if (typeof module === "object" && "default" in module) {
      return module.default;
    }
    return module;
  };
}
export {
  createResolver,
  createSimpleResolver,
  initInertia,
  router2 as router
};
//# sourceMappingURL=svelte.esm.js.map
