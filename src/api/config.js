export const DEV = process.env.NODE_ENV !== "production";

const { protocol, hostname, port } = window.location;

export const apiUrl = DEV
  ? "http://localhost:8000"
  : `${protocol}//${hostname}${port ? `:${port}` : ""}`;

// ----------------

// Get url
export const getUrl = end => {
  let endUrl = end.startsWith("/") ? end : "/" + end;

  return apiUrl + endUrl;
};

export const getImageUrl = url => {
  if (url.startsWith("/")) {
    return apiUrl + url;
  } else if (url.startsWith("http")) {
    return url;
  }
  return DEV ? "/" + url : url;
};

// /public/icon // https:// works
export const getAppIcon = (icon, appName = null) => {
  if (icon.startsWith("http") || !appName) {
    return icon;
  }
  return getUrl(`/public/app/${appName}/${icon}`);
};

export const REPO_BASE_URL =
  "https://raw.githubusercontent.com/luvbyte/kikx-apps-index/main/";

export function getIconUrl(icon) {
  if (icon.startsWith("http")) return icon;
  return (
    "https://raw.githubusercontent.com/luvbyte/kikx-apps-index/refs/heads/main/icons/" +
    icon
  );
}
