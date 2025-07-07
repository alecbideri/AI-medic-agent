import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();
  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toString(),
      })
      //@ts-ignore
      .returning({ SessionChatTable });

    return NextResponse.json(result[0].SessionChatTable);
  } catch (err) {
    NextResponse.json({ error: err });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  const result = await db.select
    //@ts-ignore
    .from(SessionChatTable)
    //@ts-ignore
    .where(eq(SessionChatTable.sessionId, sessionId));
}
