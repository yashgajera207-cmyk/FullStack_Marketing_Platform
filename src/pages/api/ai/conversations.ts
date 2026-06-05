import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =========================
   GET CONVERSATIONS
========================= */

export const GET: APIRoute = async ({
  request,
}) => {

  try {

    const userId =
      new URL(
        request.url
      ).searchParams.get(
        "businessId"
      );

    if (!userId) {

      return Response.json(
        {
          success: false,
          message:
            "User ID is required",
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
      .from("ai_chats")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .order(
        "updated_at",
        {
          ascending: false,
        }
      );

    if (error) {

      console.error(
        "GET CONVERSATIONS ERROR:",
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
        chats:
          data || [],
      }
    );

  } catch (error) {

    console.error(
      "GET CONVERSATIONS ERROR:",
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

/* =========================
   CREATE CONVERSATION
========================= */

export const POST: APIRoute =
  async ({ request }) => {

    try {

      const {
        businessId,
        title,
      } =
        await request.json();

      if (!businessId) {

        return Response.json(
          {
            success: false,
            message:
              "User ID is required",
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
        .from("ai_chats")
        .insert({
          user_id:
            businessId,

          title:
            title?.trim() ||
            "New Chat",

          updated_at:
            new Date()
              .toISOString(),
        })
        .select()
        .single();

      if (error) {

        console.error(
          "CREATE CHAT ERROR:",
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
          chat: data,
        }
      );

    } catch (error) {

      console.error(
        "CREATE CHAT ERROR:",
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

/* =========================
   DELETE CONVERSATION
========================= */

export const DELETE: APIRoute =
  async ({ request }) => {

    try {

      const id =
        new URL(
          request.url
        ).searchParams.get(
          "id"
        );

      if (!id) {

        return Response.json(
          {
            success: false,
            message:
              "Chat ID required",
          },
          {
            status: 400,
          }
        );

      }

      const {
        error: messagesError,
      } = await supabase
        .from("ai_messages")
        .delete()
        .eq(
          "chat_id",
          id
        );

      if (messagesError) {

        console.error(
          "DELETE MESSAGES ERROR:",
          messagesError
        );

        return Response.json(
          {
            success: false,
            message:
              messagesError.message,
          },
          {
            status: 500,
          }
        );

      }

      const {
        error: chatError,
      } = await supabase
        .from("ai_chats")
        .delete()
        .eq(
          "id",
          id
        );

      if (chatError) {

        console.error(
          "DELETE CHAT ERROR:",
          chatError
        );

        return Response.json(
          {
            success: false,
            message:
              chatError.message,
          },
          {
            status: 500,
          }
        );

      }

      return Response.json({
        success: true,
      });

    } catch (error) {

      console.error(
        "DELETE CHAT ERROR:",
        error
      );

      return Response.json(
        {
          success: false,
          message:
            "Delete failed",
        },
        {
          status: 500,
        }
      );

    }

  };