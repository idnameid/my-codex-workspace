"use client";

import { useEffect, useState } from "react";

const sessionKey = "toeic-session-practice";

const formatMarkdown = (attempt: any) => {
  const q = attempt.question;
  const date = new Date(attempt.createdAt).toISOString().slice(0, 10);
  const tags = (q.tags as string[]).join(", ") || "-";
  const answerLetter = String.fromCharCode(65 + q.answerIndex);
  return `### 오답 [${date}] [${tags}]
Q: ${q.stem}
A) ${q.choices[0]}
B) ${q.choices[1]}
C) ${q.choices[2]}
D) ${q.choices[3]}
정답: ${answerLetter}
해설: ${q.explanation}`;
};

export default function ReviewPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [wrongs, setWrongs] = useState<any[]>([]);
  const [filter, setFilter] = useState<"session" | "all">("session");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(sessionKey);
    if (stored) {
      setSessionId(stored);
    }
  }, []);

  const loadWrongs = async () => {
    const param = filter === "session" && sessionId ? `?sessionId=${sessionId}` : "";
    const response = await fetch(`/api/review/wrongs${param}`);
    const data = await response.json();
    setWrongs(data.wrongs ?? []);
  };

  useEffect(() => {
    loadWrongs();
  }, [filter, sessionId]);

  const copySingle = async (attempt: any) => {
    await navigator.clipboard.writeText(formatMarkdown(attempt));
    setStatus("오답이 복사되었습니다.");
  };

  const copyBatch = async () => {
    const markdown = wrongs.map(formatMarkdown).join("\n\n");
    await navigator.clipboard.writeText(markdown);
    setStatus("오답 전체를 복사했습니다.");
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">오답 리뷰</h1>
        <p className="mt-2 text-sm text-slate-600">세션 또는 전체 오답을 조회하고 복사/다운로드하세요.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === "session" ? "bg-blue-600 text-white" : "border"
            }`}
            onClick={() => setFilter("session")}
          >
            이번 세션
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === "all" ? "bg-blue-600 text-white" : "border"
            }`}
            onClick={() => setFilter("all")}
          >
            전체
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={copyBatch}>
            오답 전체 복사
          </button>
          <a
            className="rounded-lg border px-4 py-2 text-sm"
            href={`/api/export/wrongs.md${filter === "session" && sessionId ? `?sessionId=${sessionId}` : ""}`}
          >
            다운로드 .md
          </a>
          <a
            className="rounded-lg border px-4 py-2 text-sm"
            href={`/api/export/wrongs.csv${filter === "session" && sessionId ? `?sessionId=${sessionId}` : ""}`}
          >
            다운로드 .csv
          </a>
        </div>
        {status && <p className="mt-2 text-xs text-slate-500">{status}</p>}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">오답 목록</h2>
        {wrongs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">오답이 없습니다.</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {wrongs.map((attempt) => (
              <div key={attempt.id} className="rounded-lg border p-4">
                <p className="text-sm font-semibold">{attempt.question.stem}</p>
                <p className="mt-2 text-xs text-slate-500">
                  태그: {(attempt.question.tags as string[]).join(", ")}
                </p>
                <p className="mt-2 text-xs text-slate-500">정답: {String.fromCharCode(65 + attempt.question.answerIndex)}</p>
                <button
                  type="button"
                  className="mt-3 rounded-lg border px-3 py-1 text-xs"
                  onClick={() => copySingle(attempt)}
                >
                  오답 복사
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
