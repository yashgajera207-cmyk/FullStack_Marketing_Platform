import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );


    const formData =
      await request.formData();

    const logo =
      formData.get("logo") as File;

    const businessName =
      formData.get(
        "businessName"
      ) as string;

    const fullName =
      formData.get(
        "fullName"
      ) as string;

    const email =
      formData.get(
        "email"
      ) as string;

    const phone =
      formData.get(
        "phone"
      ) as string;

    const address =
      formData.get(
        "address"
      ) as string;

    const gst =
      formData.get(
        "gst"
      ) as string;

    const password =
      formData.get(
        "password"
      ) as string;

    if (
      !businessName ||
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !gst ||
      !password
    ) {
      return Response.json(
        {
          success: false,
          message:
            "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    let logoUrl = "";

    if (logo && logo.size > 0) {

      const fileExt =
        logo.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            "business-logos"
          )
          .upload(
            fileName,
            logo
          );

      if (uploadError) {
        return Response.json(
          {
            success: false,
            message:
              uploadError.message,
          },
          {
            status: 400,
          }
        );
      }

      const {
        data: publicData,
      } =
        supabase.storage
          .from(
            "business-logos"
          )
          .getPublicUrl(
            fileName
          );

      logoUrl =
        publicData.publicUrl;
    }

    const { data, error } =
  await supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
  });

if (error) {
  return Response.json(
    {
      success: false,
      message: error.message,
    },
    {
      status: 400,
    }
  );
}

const { error: businessError } =
  await supabase
    .from("business")
    .insert({
      business_name: businessName,
      owner_name: fullName,
      email: email.toLowerCase(),
      phone,
      address,
      gst_number: gst,
      logo_url: logoUrl,
      password,
    });

if (businessError) {
  return Response.json(
    {
      success: false,
      message:
        businessError.message,
    },
    {
      status: 400,
    }
  );
}

return Response.json({
  success: true,
  user: data.user,
  logoUrl,
  message:
    "Registration successful",
});


  } catch (error) {

    console.error(
      "REGISTER ERROR:",
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
