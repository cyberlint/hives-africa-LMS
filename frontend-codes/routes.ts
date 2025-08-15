/**
 *Array of routes which are available to all users
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/"];

/**
 * Array of routes for authentication
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/verify-email",
  "/match-password",
  "/signin/google/callback",
  "/api/auth/google",
];

/**
 *default redirect url
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";

class Route {
  dashboard: string = "/dashboard";

  get dashboardUrl() {
    return this.dashboard;
  }
  workspaceDashboardUrl(workspaceId: string): string {
    return `${this.dashboard}/${workspaceId};`
  }
  boardUrl(boardId: string, workspaceId: string): string {
    return `/board/${boardId}?workspace=${workspaceId};`
  }

  retroUrl(boardId: string, workspaceId: string): string {
    return `/dashboard/${workspaceId}/retrospectives/${boardId}/retro;`
  }
}

const route = new Route();
export default route;