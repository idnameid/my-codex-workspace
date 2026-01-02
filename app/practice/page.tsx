"use client";

import { useEffect, useMemo, useState } from "react";
import TagTree from "@/components/TagTree";
import QuestionCard from "@/components/QuestionCard";
import { tagTree, flattenTags } from "@/lib/tagTree";

const sessionKey = "toeic-session-practice";

const buildMarkdown = (wrongs: any[]) => {
  return wrongs
    .map((attempt: any, index: number) => {
      const q = attempt.question;
      const date = new Date(attempt.createdAt).toISOString().slice(0, 10);
      const tags = (q.tags as string[]).join(", ") || "-";
      const answerLetter = String.fromCharCode(65 + q.answerIndex);
      return `### 오답 ${index + 1}  [${date}]  [${tags}]
Q: ${q.stem}
A) ${q.choices[0]}
B) ${q.choices[1]}
C) ${q.choices[2]}
D) ${q.choices[3]}
정답: ${answerLetter}
해설: ${q.explanation}`;
    })
    .join("\n\n");
};

export default function PracticePage() {
  const [mode, setMode] = useState<"all" | "tags">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const tags = useMemo(() => flattenTags(tagTree).filter((node) => node.children === undefined), []);

  useEffect(() => {
    const stored = window.localStorage.getItem(sessionKey);
    if (stored) {
      setSessionId(stored);
    }
  }, []);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tag) => tag !== id) : [...prev, id]
    );
  };

  const handleCopySession = async () => {
    if (!sessionId) return;
    const response = await fetch(`/api/review/wrongs?sessionId=${sessionId}`);
    const data = await response.json();
    const markdown = buildMarkdown(data.wrongs ?? []);
    await navigator.clipboard.writeText(markdown);
    setCopyStatus("이번 세션 오답을 복사했습니다.");
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">연습 모드</h1>
        <p className="mt-2 text-sm text-slate-600">종합 또는 유형선택 모드를 고른 뒤 문제를 풀어보세요.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === "all" ? "bg-blue-600 text-white" : "border"
            }`}
            onClick={() => setMode("all")}
          >
            종합
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === "tags" ? "bg-blue-600 text-white" : "border"
            }`}
            onClick={() => setMode("tags")}
          >
            유형선택
          </button>
        </div>
      </section>

      {mode === "tags" && (
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">문법 트리 선택</h2>
          <p className="mt-2 text-sm text-slate-600">선택한 태그 중 하나라도 포함된 문제가 출제됩니다. (OR 규칙)</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <TagTree nodes={tagTree} selected={selectedTags} onToggle={toggleTag} />
            <div className="rounded-lg border border-dashed p-4 text-sm text-slate-600">
              <p className="font-semibold">선택된 태그</p>
              <ul className="mt-2 list-disc pl-5">
                {selectedTags.length === 0 && <li>선택 없음</li>}
                {selectedTags.map((tag) => {
                  const label = tags.find((node) => node.id === tag)?.label_ko ?? tag;
                  return <li key={tag}>{label}</li>;
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      <QuestionCard mode={mode} tags={selectedTags} sessionKey={sessionKey} />

      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">오답 관리</h2>
        <p className="mt-2 text-sm text-slate-600">현재 세션 오답을 복사하거나 파일로 내려받으세요.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm"
            onClick={handleCopySession}
          >
            이번 오답 전체 복사
          </button>
          <a
            className="rounded-lg border px-4 py-2 text-sm"
            href={`/api/export/wrongs.md?sessionId=${sessionId}`}
          >
            다운로드 .md
          </a>
          <a
            className="rounded-lg border px-4 py-2 text-sm"
            href={`/api/export/wrongs.csv?sessionId=${sessionId}`}
          >
            다운로드 .csv
          </a>
        </div>
        {copyStatus && <p className="mt-2 text-xs text-slate-500">{copyStatus}</p>}
      </section>
    </div>
  );
}
