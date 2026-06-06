import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (
  context,
  next
) => {
  const pathname = context.url.pathname;

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
  ];

  if (publicRoutes.includes(pathname)) {
    return next();
  }

  if (pathname.startsWith("/dashboard")) {
    const session = context.cookies.get("session");

    if (!session?.value) {
      return context.redirect("/login");
    }
  }

  return next();
};