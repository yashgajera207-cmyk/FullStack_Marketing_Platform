import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const GET: APIRoute = async () => {

  try {

    const {
      data,
      error,
    } = await supabase
      .from("business")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();

    if (error) {

      console.error(
        "BUSINESS PROFILE ERROR:",
        error
      );

      return Response.json(
        {
          success: false,
          message:
            error.message,
        },
        {
          status: 400,
        }
      );

    }

    if (!data) {

      return Response.json(
        {
          success: false,
          message:
            "Business profile not found",
        },
        {
          status: 404,
        }
      );

    }

    return Response.json({
      success: true,
      user: data,
    });

  } catch (error) {

    console.error(
      "BUSINESS PROFILE ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Server Error",
      },
      {
        status: 500,
      }
    );

  }

};