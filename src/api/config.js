export const DEV = process.env.NODE_ENV !== "production";

// Getting from location
const { protocol, hostname, port } = window.location;

// API URL
export const apiUrl = DEV
  ? "http://localhost:8000"
  : `${protocol}//${hostname}${port ? `:${port}` : ""}`;

// Combine ApiUrl + Endpoint
export const getUrl = end => {
  let endUrl = end.startsWith("/") ? end : "/" + end;

  return apiUrl + endUrl;
};

// Get any image url
export const getImageUrl = url => {
  if (url.startsWith("/")) {
    return apiUrl + url;
  } else if (url.startsWith("http")) {
    return url;
  }
  return DEV ? "/" + url : url;
};

// Get app icon from public folder
export const getAppIcon = (icon, appName = null) => {
  return getUrl(`/public/app/${appName}/${icon}`);
};

// Github apps index repo url
export const REPO_BASE_URL =
  "https://raw.githubusercontent.com/luvbyte/kikx-apps-index/main/";

export function getIconUrl(icon) {
  if (icon.startsWith("http")) return icon;
  return (
    "https://raw.githubusercontent.com/luvbyte/kikx-apps-index/refs/heads/main/icons/" +
    icon
  );
}
