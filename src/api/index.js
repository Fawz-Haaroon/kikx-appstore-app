import { createApp } from "kikx-sdk";
import { DEV, apiUrl } from "@/api/config";

const app = createApp();

// If its dev mode
if (DEV) {
  app.config.configureUrls({
    apiUrl,
    appID: "19b9d9e0059f410f9e9c76b4f94112ca"
  });
}

export { app };
