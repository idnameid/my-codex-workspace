import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  const attempts = await prisma.attempt.findMany({
    where: {
      isCorrect: false,
      ...(sessionId ? { sessionId } : {})
    },
    orderBy: { createdAt: "desc" },
    include: { question: true }
  });

  return NextResponse.json({ wrongs: attempts });
}
