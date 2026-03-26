import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { email, password, username, role, requester_id } = await req.json();

    // Validate required fields
    if (!email || !password || !username) {
      return new Response(JSON.stringify({ error: "Email, password, and username are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If requester_id provided, verify they are super_admin
    if (requester_id) {
      const { data: roleData } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", requester_id)
        .eq("role", "super_admin")
        .single();

      if (!roleData) {
        return new Response(JSON.stringify({ error: "Only super admins can create admins" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Create user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (userError) throw userError;

    // Assign role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userData.user.id, role: role || "admin" });

    if (roleError) throw roleError;

    return new Response(JSON.stringify({ success: true, user_id: userData.user.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
