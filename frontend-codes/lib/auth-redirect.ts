import { authRoutes } from "@/routes";

const DEFAULT_REDIRECT = "/home";

function isSafeRedirect(value: string): boolean {
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  return true;
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function getSafeRedirectPath(value: string | null | undefined): string {
  if (!value) return DEFAULT_REDIRECT;

  try {
    const decoded = decodeURIComponent(value);
    if (!isSafeRedirect(decoded)) return DEFAULT_REDIRECT;

    const url = new URL(decoded, "http://local");
    const pathname = url.pathname;

    if (isAuthRoute(pathname)) {
      const nested = url.searchParams.get("redirectTo");
      if (nested) return getSafeRedirectPath(nested);
      return DEFAULT_REDIRECT;
    }

    return url.pathname + url.search;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export function getRedirectPathFromReferer(referer: string | null | undefined): string {
  if (!referer) return DEFAULT_REDIRECT;

  try {
    const url = new URL(referer);
    const pathname = url.pathname + url.search;
    return getSafeRedirectPath(pathname);
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export function buildLoginRedirect(pathname?: string | null): string {
  const safePath = getSafeRedirectPath(pathname);
  return `/signin?redirectTo=${encodeURIComponent(safePath)}`;
}
