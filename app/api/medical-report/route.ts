import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm"; // Make sure this import is added

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor AI agent info and conversation between AI medical agent and User, generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:
{
 "sessionId": "string",
 "agent": "string",
 "user": "string",
 "timestamp": "ISO Date string",
 "chiefComplaint": "string",
 "summary": "string",
 "symptoms": ["symptom1", "symptom2"],
 "duration": "string",
 "severity": "string",
 "medicationsMentioned": ["med1", "med2"],
 "recommendations": ["rec1", "rec2"]
}

Only include valid fields. Respond with nothing else but valid JSON.`;

export async function POST(req: NextRequest) {
  console.log("Starting medical report generation...");

  try {
    const { sessionId, sessionDetail, messages } = await req.json();

    // Add validation
    if (!sessionId || !sessionDetail || !messages) {
      console.error("Missing required fields:", {
        sessionId,
        sessionDetail,
        messages,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("Request data:", { sessionId, sessionDetail, messages });

    const UserInput =
      "AI Doctor Agent Info:" +
      JSON.stringify(sessionDetail) +
      ", conversation:" +
      JSON.stringify(messages);

    console.log("Sending to OpenAI:", UserInput);

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite-preview-06-17",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        {
          role: "user",
          content:
            UserInput +
            " Generate a medical report based on this conversation in JSON format only.",
        },
      ],
    });

    console.log("OpenAI response:", completion.choices[0].message);

    const rawResp = completion.choices[0].message.content;

    if (!rawResp) {
      throw new Error("No response from OpenAI");
    }

    // Clean up the response
    const cleanResp = rawResp
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^[^{]*/, "") // Remove any text before the first {
      .replace(/[^}]*$/, ""); // Remove any text after the last }

    console.log("Cleaned response:", cleanResp);

    let JSONResp;
    try {
      JSONResp = JSON.parse(cleanResp);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", rawResp);
      throw new Error("Failed to parse JSON response");
    }

    console.log("Parsed JSON:", JSONResp);

    // Add sessionId to the response if it's missing
    if (!JSONResp.sessionId) {
      JSONResp.sessionId = sessionId;
    }

    // Add timestamp if missing
    if (!JSONResp.timestamp) {
      JSONResp.timestamp = new Date().toISOString();
    }

    // Save data in the database
    console.log("Saving to database...");
    const result = await db
      .update(SessionChatTable)
      .set({
        report: JSONResp,
      })
      .where(eq(SessionChatTable.sessionId, sessionId));

    console.log("Database update result:", result);
    console.log("Final response:", JSONResp);

    return NextResponse.json(JSONResp);
  } catch (error) {
    console.error("Error in medical report generation:", error);
    return NextResponse.json(
      {
        error: "Failed to generate medical report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
