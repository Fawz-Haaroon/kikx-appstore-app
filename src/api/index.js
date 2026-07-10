import { createApp } from "kikx-sdk";
import { DEV, apiUrl } from "@/api/config";

const app = createApp();

if (DEV) {
  app.config.configureUrls({
    apiUrl,
    appID: "444617590cd040709cb185c6f21960a3"
  });
}

export { app };
