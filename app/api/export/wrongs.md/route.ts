import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const formatMarkdown = (attempts: any[]) => {
  return attempts
    .map((attempt, index) => {
      const question = attempt.question;
      const date = new Date(attempt.createdAt).toISOString().slice(0, 10);
      const tags = (question.tags as string[]).join(", ") || "-";
      const choices = question.choices as string[];
      const answerLetter = String.fromCharCode(65 + question.answerIndex);
      return `### 오답 ${index + 1}  [${date}]  [${tags}]
Q: ${question.stem}
A) ${choices[0]}
B) ${choices[1]}
C) ${choices[2]}
D) ${choices[3]}
정답: ${answerLetter}
해설: ${question.explanation}`;
    })
    .join("\n\n");
};

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

  const markdown = formatMarkdown(attempts);
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "attachment; filename=wrongs.md"
    }
  });
}
