import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(
  async (context, next) => {

    const pathname =
      context.url.pathname;

    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/api/auth/login",
      "/api/auth/register",
    ];

    if (
      publicRoutes.includes(
        pathname
      )
    ) {
      return next();
    }

    if (
      pathname.startsWith(
        "/dashboard"
      )
    ) {

      const session =
        context.cookies.get(
          "session"
        );

      if (
        !session ||
        !session.value
      ) {

        return context.redirect(
          "/login"
        );

      }

    }

    return next();

  }
);