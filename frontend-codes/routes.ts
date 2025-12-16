/**
 *Array of routes which are available to all users
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/checkout",
  "/course",
  "/payment",
  "/waitlist",
];

/**
 * Array of routes for authentication
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

/**
 * Array of admin routes
 * @type {string[]}
 */
export const adminRoutes: string[] = ["/admin"];

/**
 * Array of student routes (protected routes for users with 'user' role)
 * @type {string[]}
 */
export const studentRoutes: string[] = [
  "/dashboard",
  "/achievements",
  "/analytics",
  "/cart",
  "/courses",
  "/help",
  "/learning",
  "/lecture",
  "/purchases",
  "/quiz",
  "/settings",
  "/wishlist",
];

/**
 * API routes accessible by students
 * @type {string[]}
 */
export const studentApiRoutes: string[] = [
  "/api/user",
  "/api/courses",
  "/api/enrollments",
  "/api/purchases",
  "/api/quiz",
  "/api/s3",
  "/api/webhooks",
];

/**
 * API routes accessible by admins
 * @type {string[]}
 */
export const adminApiRoutes: string[] = [
  "/api/courses",
  "/api/enrollments",
  "/api/payments",
  "/api/purchases",
  "/api/quiz",
  "/api/s3",
  "/api/user",
  "/api/webhooks",
];

/**
 * Default redirect url for students
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";

/**
 * Default redirect url for admins
 * @type {string}
 */
export const DEFAULT_ADMIN_LOGIN_REDIRECT: string = "/admin";