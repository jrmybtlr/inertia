// src/client/react.ts
import { router, setupProgress } from "@inertiajs/core";
import { router as router2 } from "@inertiajs/core";
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
  router.init({
    initialPage,
    resolveComponent,
    swapComponent: async ({ component, page, preserveState }) => {
    }
  });
  if (progress !== false) {
    setupProgress(progress || {});
  }
  const props = {
    initialPage,
    initialComponent,
    resolveComponent,
    titleCallback: options.title
  };
  const root = createRoot(islandEl);
  root.render(createElement(App, props));
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
  initInertia,
  router2 as router
};
//# sourceMappingURL=react.esm.js.map
