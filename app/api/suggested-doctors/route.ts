import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite-preview-06-17",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content:
            "User Notes/Symptoms:" +
            notes +
            " depends on user notes and symptoms, please suggest list of doctors , Return Object in JSON only",
        },
      ],
    });
    const rawResp = completion.choices[0].message;
    return NextResponse.json(rawResp);
  } catch (e) {
    return NextResponse.json(e);
  }
}
