import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtectedCustomerRoute = createRouteMatcher(["/checkout(.*)", "/account(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLoginPage = createRouteMatcher(["/admin/login"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Admin login page — always allow through
  if (isAdminLoginPage(request)) return;

  // Admin routes — let through, the admin layout handles role checks + redirect to /admin/login
  if (isAdminRoute(request)) return;

  // Customer-protected routes — redirect to user login if not authenticated
  if (isProtectedCustomerRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
