import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =========================
   GET CHAT MESSAGES
========================= */

export const GET: APIRoute = async ({
  request,
}) => {

  try {

    const chatId =
      new URL(
        request.url
      ).searchParams.get(
        "chatId"
      );

    if (!chatId) {

      return Response.json(
        {
          success: false,
          message:
            "Chat ID is required",
        },
        {
          status: 400,
        }
      );

    }

    const {
      data,
      error,
    } = await supabase
      .from("ai_messages")
      .select("*")
      .eq(
        "chat_id",
        chatId
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

    if (error) {

      console.error(
        "GET MESSAGES ERROR:",
        error
      );

      return Response.json(
        {
          success: false,
          message:
            error.message,
        },
        {
          status: 500,
        }
      );

    }

    return Response.json(
      {
        success: true,
        count:
          data?.length || 0,
        messages:
          data || [],
      }
    );

  } catch (error) {

    console.error(
      "GET MESSAGES ERROR:",
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