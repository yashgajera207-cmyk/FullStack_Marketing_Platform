import type { APIRoute } from "astro";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

const openrouterApiKey =
  import.meta.env.OPENROUTER_API_KEY;

if (!openrouterApiKey) {
  throw new Error(
    "OPENROUTER_API_KEY is missing"
  );
}

const openai =
  new OpenAI({
    apiKey:
      openrouterApiKey,


    baseURL:
      "https://openrouter.ai/api/v1",

    defaultHeaders: {
      "HTTP-Referer":
        "http://localhost:4321",

      "X-Title":
        "Marketing FullStack App",
    },


  });

export const POST: APIRoute =
  async ({ request }) => {


    let chatId = "";
    let message = "";

    try {

      const body =
        await request.json();

      chatId =
        body.chatId;

      message =
        body.message;

      if (
        !chatId ||
        !message
      ) {

        return Response.json(
          {
            success: false,
            message:
              "chatId and message are required",
          },
          {
            status: 400,
          }
        );

      }

      /* =========================
         SAVE USER MESSAGE
      ========================= */

      await supabase
        .from(
          "ai_messages"
        )
        .insert({
          chat_id:
            chatId,

          role:
            "user",

          content:
            message,
        });

      /* =========================
         LOAD CHAT HISTORY
      ========================= */

      const {
        data:
        history,
      } =
        await supabase
          .from(
            "ai_messages"
          )
          .select(
            "role,content"
          )
          .eq(
            "chat_id",
            chatId
          )
          .order(
            "created_at",
            {
              ascending:
                true,
            }
          );

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content:
            "You are a professional AI business assistant. Give clear, concise and helpful answers.",
        },
      ];

      for (const msg of history || []) {

        if (
          msg.role !== "user" &&
          msg.role !== "assistant"
        ) {
          continue;
        }

        messages.push({
          role: msg.role,
          content:
            String(
              msg.content || ""
            ),
        });

      }
      /* =========================
         OPENROUTER REQUEST
      ========================= */

      const completion =
        await openai.chat.completions.create(
          {
            model: "openai/gpt-4o-mini",

            messages,

            temperature:
              0.7,

            max_tokens:
              1000,
          }
        );

      const reply =
        completion
          .choices?.[0]
          ?.message
          ?.content ||
        "No response generated.";

      /* =========================
         SAVE AI MESSAGE
      ========================= */

      await supabase
        .from(
          "ai_messages"
        )
        .insert({
          chat_id:
            chatId,

          role:
            "assistant",

          content:
            reply,
        });

      /* =========================
         UPDATE CHAT
      ========================= */

      await supabase
        .from(
          "ai_chats"
        )
        .update({
          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          chatId
        );

      return Response.json(
        {
          success:
            true,

          reply,
        }
      );

    } catch (
    error: any
    ) {

      console.error(
        "AI CHAT ERROR FULL:"
      );

      console.error(
        JSON.stringify(
          error,
          null,
          2
        )
      );

      let errorMessage =
        "AI service is temporarily unavailable.";

      if (error?.status === 404) {

        errorMessage =
          "AI model not found. Please update the OpenRouter model.";

      }
      else if (error?.status === 429) {

        errorMessage =
          "AI provider is busy right now. Please try again in a few seconds.";

      }

      try {

        if (chatId) {

          await supabase
            .from(
              "ai_messages"
            )
            .insert({
              chat_id:
                chatId,

              role:
                "assistant",

              content:
                errorMessage,
            });

        }

      } catch (
      saveError
      ) {

        console.error(
          "SAVE ERROR MESSAGE FAILED:",
          saveError
        );

      }

      return Response.json(
        {
          success:
            false,

          message:
            errorMessage,
        },
        {
          status:
            error?.status ||
            500,
        }
      );

    }


  };
