import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">관리</h1>
        <p className="mt-2 text-sm text-slate-600">최근 등록된 문제 20개를 확인합니다.</p>
      </section>
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">문제 목록</h2>
        <div className="mt-4 grid gap-4">
          {questions.map((question) => (
            <div key={question.id} className="rounded-lg border p-4">
              <p className="text-sm font-semibold">{question.stem}</p>
              <p className="mt-2 text-xs text-slate-500">태그: {(question.tags as string[]).join(", ")}</p>
              <p className="mt-1 text-xs text-slate-500">정답: {String.fromCharCode(65 + question.answerIndex)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
