import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { jobId } = await req.json();

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: "jobId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the job
    const { data: job, error: fetchError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (fetchError || !job) {
      return new Response(
        JSON.stringify({ error: "Job not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update status to running
    await supabase
      .from("jobs")
      .update({ status: "running" })
      .eq("id", jobId);

    console.log(`[Job ${jobId}] Started running: ${job.task_name}`);

    // Simulate processing (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const completedAt = new Date().toISOString();
    let webhookResponse = null;

    // Trigger webhook if URL is provided
    if (job.webhook_url) {
      try {
        console.log(`[Job ${jobId}] Triggering webhook: ${job.webhook_url}`);
        
        const webhookPayload = {
          jobId: job.id,
          taskName: job.task_name,
          priority: job.priority,
          payload: job.payload,
          completedAt,
        };

        const webhookResult = await fetch(job.webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        });

        webhookResponse = {
          status: webhookResult.status,
          statusText: webhookResult.statusText,
          sentAt: new Date().toISOString(),
        };

        console.log(`[Job ${jobId}] Webhook response: ${webhookResult.status}`);
      } catch (webhookError) {
        const errorMessage = webhookError instanceof Error ? webhookError.message : 'Unknown error';
        console.error(`[Job ${jobId}] Webhook error:`, webhookError);
        webhookResponse = {
          error: errorMessage,
          sentAt: new Date().toISOString(),
        };
      }
    }

    // Update status to completed
    await supabase
      .from("jobs")
      .update({
        status: "completed",
        completed_at: completedAt,
        webhook_response: webhookResponse,
      })
      .eq("id", jobId);

    console.log(`[Job ${jobId}] Completed successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        completedAt,
        webhookResponse,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error running job:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
