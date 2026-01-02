import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { selectQuestions } from "@/lib/questionSelector";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = (searchParams.get("mode") ?? "all") as "all" | "tags";
  const tagsParam = searchParams.get("tags") ?? "";
  const count = Number(searchParams.get("count") ?? "1");
  const sessionId = searchParams.get("sessionId") ?? undefined;
  const tags = tagsParam.length ? tagsParam.split(",").filter(Boolean) : [];

  const questions = await prisma.question.findMany();
  const attempts = await prisma.attempt.findMany();
  const recentAttempts = sessionId
    ? await prisma.attempt.findMany({
        where: { sessionId },
        orderBy: { createdAt: "desc" },
        take: 20
      })
    : [];

  const recentQuestionIds = recentAttempts.map((attempt) => attempt.questionId);
  const selected = selectQuestions(questions, attempts, {
    mode,
    tags,
    count,
    recentQuestionIds
  });

  return NextResponse.json({
    questions: selected
  });
}
