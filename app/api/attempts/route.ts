import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    userId,
    sessionId,
    questionId,
    selectedIndex,
    isCorrect,
    timeMs
  } = body;

  if (!sessionId || !questionId || selectedIndex === undefined) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId: userId ?? null,
      sessionId,
      questionId,
      selectedIndex,
      isCorrect: Boolean(isCorrect),
      timeMs: Number(timeMs ?? 0)
    }
  });

  return NextResponse.json({ attempt });
}
