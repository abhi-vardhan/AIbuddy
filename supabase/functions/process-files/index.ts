
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
    // Check if the request is FormData
    const contentType = req.headers.get('content-type') || '';
    let file;
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      file = formData.get('file');
      
      if (!file || !(file instanceof File)) {
        throw new Error("No file provided");
      }
    } else {
      throw new Error("Invalid request format, expected FormData");
    }

    // Read file content
    let fileContent = "";
    if (file.type === 'application/pdf') {
      // For now, we'll use a simplified approach for PDF
      // In a production app, you'd want to use a PDF parsing library
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      fileContent = new TextDecoder().decode(uint8Array);
      // This won't parse PDF properly, but will extract some text
    } else if (file.type === 'text/plain' || file.type.includes('text')) {
      fileContent = await file.text();
    } else if (file.type.includes('word') || file.type.includes('openxmlformats')) {
      // For Word docs, extract as text (simplified)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      fileContent = new TextDecoder().decode(uint8Array);
    } else {
      throw new Error("Unsupported file type");
    }

    // Truncate content if too large
    const maxLength = 10000; // Limit content to prevent API issues
    if (fileContent.length > maxLength) {
      fileContent = fileContent.substring(0, maxLength);
      console.log("File content truncated to prevent API overload");
    }

    // Process with Gemini API
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    // Generate study guide
    const studyGuidePrompt = `
      You are an expert study guide creator. I'll provide you with study material, and I want you to:
      1. Create a comprehensive study guide with clear sections
      2. For each section, extract key points and write a concise summary
      3. Format your response as JSON with this structure:
      {
        "title": "Study Guide: [Topic]",
        "content": [
          {
            "section": "Section Title",
            "keyPoints": ["Key point 1", "Key point 2", ...],
            "summary": "Section summary..."
          },
          ...
        ]
      }
      
      Only include 3-5 sections maximum. Here is the study material:
      ${fileContent}
    `;

    const studyGuideResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: studyGuidePrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8000
        }
      })
    });

    if (!studyGuideResponse.ok) {
      const errorText = await studyGuideResponse.text();
      console.error("Gemini API error (study guide):", errorText);
      throw new Error("Failed to generate study guide: " + errorText);
    }

    const studyGuideData = await studyGuideResponse.json();
    let studyGuide = { title: "Study Guide", content: [] };
    
    try {
      // Extract the JSON from the response text
      const responseText = studyGuideData.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/{[\s\S]*}/);
                       
      if (jsonMatch) {
        studyGuide = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        console.warn("Failed to parse JSON study guide, using fallback parsing");
        // Attempt to create a basic structure from the text
        const sections = responseText.split(/\n#+\s/);
        const title = sections[0].trim();
        const content = sections.slice(1).map(section => {
          const lines = section.split('\n');
          const sectionTitle = lines[0].trim();
          return {
            section: sectionTitle,
            keyPoints: responseText.match(/\*\s(.*)/g)?.map(p => p.replace('* ', '')) || ["Key point extracted from text"],
            summary: lines.slice(1).join(' ').substring(0, 200) + "..."
          };
        });
        studyGuide = { title, content: content.slice(0, 5) };
      }
    } catch (error) {
      console.error("Error parsing study guide:", error);
      // Provide a fallback if parsing fails
      studyGuide = {
        title: "Study Guide: " + file.name,
        content: [{
          section: "Main Concepts",
          keyPoints: ["Key concept from document", "Important information extracted"],
          summary: "Summary of the document content..."
        }]
      };
    }

    // Generate flashcards
    const flashcardPrompt = `
      You are an expert flashcard creator. I'll provide you with study material, and I want you to:
      1. Create a set of question-answer flashcards based on the material
      2. Focus on important concepts, definitions, and facts
      3. Format your response as JSON with this structure:
      {
        "title": "Flashcards: [Topic]",
        "cards": [
          {
            "id": 1,
            "question": "Question text",
            "answer": "Answer text"
          },
          ...
        ]
      }
      
      Create exactly 10 flashcards. Here is the study material:
      ${fileContent}
    `;

    const flashcardResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: flashcardPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8000
        }
      })
    });

    if (!flashcardResponse.ok) {
      const errorText = await flashcardResponse.text();
      console.error("Gemini API error (flashcards):", errorText);
      throw new Error("Failed to generate flashcards: " + errorText);
    }

    const flashcardData = await flashcardResponse.json();
    let flashcards = { title: "Flashcards", cards: [] };
    
    try {
      // Extract the JSON from the response text
      const responseText = flashcardData.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/{[\s\S]*}/);
                       
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        console.warn("Failed to parse JSON flashcards, using fallback parsing");
        // Basic fallback cards from response text
        flashcards = {
          title: "Flashcards: " + file.name,
          cards: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            question: `Question ${i + 1} about the content`,
            answer: `Answer to question ${i + 1}`
          }))
        };
      }
    } catch (error) {
      console.error("Error parsing flashcards:", error);
      // Provide fallback cards
      flashcards = {
        title: "Flashcards: " + file.name,
        cards: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          question: `Question ${i + 1}`,
          answer: `Answer to question ${i + 1}`
        }))
      };
    }

    // Generate quiz
    const quizPrompt = `
      You are an expert quiz creator. I'll provide you with study material, and I want you to:
      1. Create multiple-choice quiz questions based on the material
      2. Each question should have 4 possible answers with one correct answer
      3. Format your response as JSON with this structure:
      {
        "title": "Quiz: [Topic]",
        "questions": [
          {
            "id": 1,
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswerIndex": 0  // 0-based index of the correct answer
          },
          ...
        ]
      }
      
      Create exactly 5 quiz questions. Here is the study material:
      ${fileContent}
    `;

    const quizResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: quizPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8000
        }
      })
    });

    if (!quizResponse.ok) {
      const errorText = await quizResponse.text();
      console.error("Gemini API error (quiz):", errorText);
      throw new Error("Failed to generate quiz: " + errorText);
    }

    const quizData = await quizResponse.json();
    let quiz = { title: "Quiz", questions: [] };
    
    try {
      // Extract the JSON from the response text
      const responseText = quizData.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/{[\s\S]*}/);
                       
      if (jsonMatch) {
        quiz = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        console.warn("Failed to parse JSON quiz, using fallback parsing");
        // Basic fallback quiz from response text
        quiz = {
          title: "Quiz: " + file.name,
          questions: Array.from({ length: 3 }, (_, i) => ({
            id: i + 1,
            question: `Question ${i + 1} about the material`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswerIndex: Math.floor(Math.random() * 4)
          }))
        };
      }
    } catch (error) {
      console.error("Error parsing quiz:", error);
      // Provide fallback quiz
      quiz = {
        title: "Quiz: " + file.name,
        questions: Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          question: `Question ${i + 1}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswerIndex: Math.floor(Math.random() * 4)
        }))
      };
    }

    // Generate audio summary data (just provide a placeholder for now)
    // In a real implementation, this would call a text-to-speech API
    const audio = {
      title: "Audio Summary: " + file.name,
      audioUrl: "https://example.com/audio.mp3" // Placeholder
    };

    // Return all generated data
    return new Response(
      JSON.stringify({
        success: true,
        studyGuide,
        flashcards,
        quiz,
        audio
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in process-files function:", error);
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
