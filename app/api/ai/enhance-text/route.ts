import { NextRequest, NextResponse } from "next/server";
import { getOpenAIApiKey } from "@/lib/openai-config";

interface EnhanceTextRequest {
  text: string;
  context?: {
    type: string;
    opportunityName?: string;
    organization?: string;
    stage?: string;
    value?: string;
    description?: string;
  };
  prompt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhanceTextRequest = await request.json();
    const { text, context, prompt } = body;

    if (!text && !context?.opportunityName) {
      return NextResponse.json(
        { error: "Text or context is required" },
        { status: 400 }
      );
    }

    // Build the system prompt based on context type
    let systemPrompt = "You are a professional business writer specializing in sales and consulting.";
    let userPrompt = prompt || "Enhance this text to be more professional and compelling.";

    if (context?.type === "opportunity_description") {
      systemPrompt = `You are a professional business writer specializing in sales opportunities and consulting proposals. 
You write clear, compelling descriptions that highlight value propositions and business outcomes.
Keep the tone professional but engaging. Focus on the business impact and potential value.`;
      
      userPrompt = `${prompt || "Create a professional, compelling description for this sales opportunity."}

Context:
- Opportunity Name: ${context.opportunityName || "Not specified"}
- Organization: ${context.organization || "Not specified"}
- Stage: ${context.stage || "Lead"}
- Deal Value: ${context.value ? `$${context.value}` : "Not specified"}

Original text to enhance:
${text}

Please provide an enhanced, professional description that:
1. Clearly states the business opportunity
2. Highlights the potential value and impact
3. Is concise but informative (2-3 paragraphs)
4. Uses professional business language`;
    } else if (context?.type === "opportunity_notes") {
      systemPrompt = `You are a professional business analyst who creates clear, actionable notes for sales opportunities.
You organize information logically and highlight key action items and next steps.`;
      
      userPrompt = `${prompt || "Expand and professionalize these notes for a sales opportunity."}

Context:
- Opportunity Name: ${context.opportunityName || "Not specified"}
- Organization: ${context.organization || "Not specified"}
- Stage: ${context.stage || "Lead"}
- Description: ${context.description || "Not provided"}

Original notes to enhance:
${text}

Please provide enhanced notes that:
1. Are well-organized with clear sections
2. Include action items and next steps
3. Highlight key considerations and risks
4. Use bullet points for readability
5. Maintain a professional tone`;
    }

    // Get API key from stored LLM settings (Firebase or env vars)
    const apiKey = await getOpenAIApiKey();
    
    console.log("[enhance-text] API key found:", !!apiKey);
    console.log("[enhance-text] Environment OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);

    let enhancedText: string;

    if (apiKey) {
      try {
        console.log("[enhance-text] Calling OpenAI...");
        enhancedText = await callOpenAI(apiKey, systemPrompt, userPrompt);
        console.log("[enhance-text] OpenAI call successful, response length:", enhancedText.length);
      } catch (openaiError) {
        console.error("[enhance-text] OpenAI call failed:", openaiError);
        // If OpenAI call fails, use fallback
        enhancedText = generateFallbackEnhancement(text, context);
      }
    } else {
      console.log("[enhance-text] No API key found, using fallback");
      // Fallback: Return a formatted version of the original text
      enhancedText = generateFallbackEnhancement(text, context);
    }

    return NextResponse.json({ success: true, enhancedText });
  } catch (error) {
    console.error("AI Enhance Text error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enhance text" },
      { status: 500 }
    );
  }
}

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response generated";
}

function generateFallbackEnhancement(
  text: string,
  context?: EnhanceTextRequest["context"]
): string {
  if (context?.type === "opportunity_description") {
    const orgName = context.organization || "the client";
    const oppName = context.opportunityName || "this opportunity";
    
    return `**Business Opportunity: ${oppName}**

This opportunity represents a strategic engagement with ${orgName} to deliver value-added consulting services. ${text ? `\n\n${text}` : ""}

**Key Objectives:**
- Assess current state and identify improvement opportunities
- Develop actionable recommendations aligned with business goals
- Support implementation and measure outcomes

**Expected Outcomes:**
- Enhanced operational efficiency
- Improved business processes
- Measurable return on investment

*Note: To enable AI-powered text enhancement, please configure your OpenAI API key or Ollama in Settings → LLM Configuration.*`;
  } else if (context?.type === "opportunity_notes") {
    return `**Opportunity Notes**

${text || "No initial notes provided."}

**Action Items:**
• Schedule discovery meeting with key stakeholders
• Gather relevant documentation and data
• Prepare preliminary assessment framework

**Next Steps:**
• Confirm meeting dates and attendees
• Review any existing materials
• Prepare questions for discovery session

**Key Considerations:**
• Timeline and resource availability
• Decision-making process and stakeholders
• Budget and approval requirements

*Note: To enable AI-powered text enhancement, please configure your OpenAI API key or Ollama in Settings → LLM Configuration.*`;
  }

  // Generic fallback
  return `${text}

---
*To enable AI-powered text enhancement, please configure your OpenAI API key or Ollama in Settings → LLM Configuration.*`;
}
