import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtected = createRouteMatcher(["/checkout(.*)", "/account(.*)", "/admin(.*)"]);
const isAdminOnly = createRouteMatcher(["/admin(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (!isProtected(request)) return;

  const authenticated = await convexAuth.isAuthenticated();

  if (!authenticated) {
    const redirect = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return nextjsMiddlewareRedirect(request, `/login?redirect=${redirect}`);
  }

  if (isAdminOnly(request)) {
    const token = await convexAuth.getToken();
    if (!token) return nextjsMiddlewareRedirect(request, "/");

    try {
      const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { role?: string };
      if (payload.role !== "admin") {
        return nextjsMiddlewareRedirect(request, "/");
      }
    } catch {
      return nextjsMiddlewareRedirect(request, "/");
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
