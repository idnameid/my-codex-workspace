import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

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

  const header = [
    "date",
    "tag",
    "stem",
    "choiceA",
    "choiceB",
    "choiceC",
    "choiceD",
    "answer",
    "explanation"
  ];
  const rows = attempts.map((attempt) => {
    const question = attempt.question;
    const date = new Date(attempt.createdAt).toISOString().slice(0, 10);
    const tags = (question.tags as string[]).join("|") || "-";
    const choices = question.choices as string[];
    const answerLetter = String.fromCharCode(65 + question.answerIndex);
    return [
      date,
      tags,
      question.stem,
      choices[0],
      choices[1],
      choices[2],
      choices[3],
      answerLetter,
      question.explanation
    ].map(escapeCsv).join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=wrongs.csv"
    }
  });
}
