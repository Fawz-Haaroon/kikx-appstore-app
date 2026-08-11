import { createApp } from "kikx-sdk";
import { DEV, apiUrl } from "@/api/config";

import { KVService } from "kikx-sdk";

const app = createApp();
const kv = new KVService(app);

// If its dev mode
if (DEV) {
  app.config.configureUrls({
    apiUrl,
    appID: "fc4856261e6e4832b381fb5d288ea58f"
  });
}

async function invokeTheme(theme) {
  return app.system.invoke("action", {
    name: "set-theme",
    options: {
      theme
    }
  });
}

export async function setTheme(theme) {
  invokeTheme(theme);
  kv.set("data-theme", theme);
}

export async function getTheme() {
  const theme = await kv.getOrSet("data-theme", "light");
  invokeTheme(theme);

  return theme;
}

export { app, kv };
