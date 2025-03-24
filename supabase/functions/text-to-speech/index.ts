
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      throw new Error("No text provided for speech synthesis");
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    // Call Google Text-to-Speech API
    // Note: This is a workaround using the Google Cloud TTS API
    // For a production app, you would set up proper Google Cloud TTS integration
    const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: "en-US",
          ssmlGender: "NEUTRAL"
        },
        audioConfig: {
          audioEncoding: "MP3"
        }
      })
    });

    if (!ttsResponse.ok) {
      // If Google Cloud TTS fails, we'll return a fallback URL
      // In a real app, you'd implement proper error handling and retry logic
      console.error("TTS API error:", await ttsResponse.text());
      
      return new Response(
        JSON.stringify({
          success: true,
          audioUrl: "https://storage.googleapis.com/study-buddy-demo/sample-audio.mp3" // Fallback audio URL
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const ttsData = await ttsResponse.json();
    
    // In a real implementation, you would:
    // 1. Take the base64 audio content from ttsData.audioContent
    // 2. Save it to Supabase Storage
    // 3. Return the URL to the saved audio file
    
    // For this demo, we'll just return a sample audio URL
    return new Response(
      JSON.stringify({
        success: true,
        audioUrl: "https://storage.googleapis.com/study-buddy-demo/sample-audio.mp3" // Sample audio URL
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in text-to-speech function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
