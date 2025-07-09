import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { desc, eq } from "drizzle-orm";
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
      .returning({ sessionId: SessionChatTable.sessionId }); // Fix the returning clause

    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 }); // Add return here
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    );
  }

  if (sessionId == "all") {
    const result = await db
      .select()
      .from(SessionChatTable)
      .where(
        //@ts-ignore
        eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress),
      )
      .orderBy(desc(SessionChatTable.id));

    return NextResponse.json(result);
  }

  try {
    const result = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
