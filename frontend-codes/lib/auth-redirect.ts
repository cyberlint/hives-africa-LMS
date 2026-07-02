const DEFAULT_REDIRECT = "/home";

function isSafeRedirect(value: string): boolean {
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  return true;
}

export function getSafeRedirectPath(value: string | null | undefined): string {
  if (!value) return DEFAULT_REDIRECT;

  try {
    const decoded = decodeURIComponent(value);
    return isSafeRedirect(decoded) ? decoded : DEFAULT_REDIRECT;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export function getRedirectPathFromReferer(referer: string | null | undefined): string {
  if (!referer) return DEFAULT_REDIRECT;

  try {
    const url = new URL(referer);
    const pathname = url.pathname + url.search;
    return isSafeRedirect(pathname) ? pathname : DEFAULT_REDIRECT;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export function buildLoginRedirect(pathname?: string | null): string {
  const safePath = getSafeRedirectPath(pathname);
  return `/signin?redirectTo=${encodeURIComponent(safePath)}`;
}
