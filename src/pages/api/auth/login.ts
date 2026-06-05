import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } =
      await request.json();

    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 401,
        }
      );
    }

    const token =
      data.session?.access_token;

    const response =
      Response.json({
        success: true,
        user: data.user,
        session: data.session,
      });

response.headers.append(
  "Set-Cookie",
  `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
);

    return response;

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
};