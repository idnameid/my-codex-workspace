"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";

export type QuestionItem = {
  id: string;
  stem: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  tags: string[];
  type: string;
  difficulty: number;
  trapCode?: string | null;
};

type QuestionCardProps = {
  mode: "all" | "tags";
  tags: string[];
  sessionKey: string;
  showControls?: boolean;
};

export default function QuestionCard({ mode, tags, sessionKey, showControls = true }: QuestionCardProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [lastResult, setLastResult] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(sessionKey);
    if (stored) {
      setSessionId(stored);
    } else {
      const newSession = uuidv4();
      window.localStorage.setItem(sessionKey, newSession);
      setSessionId(newSession);
    }
  }, [sessionKey]);

  const fetchQuestion = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        mode,
        count: "1",
        sessionId
      });
      if (mode === "tags" && tags.length > 0) {
        params.set("tags", tags.join(","));
      }
      const response = await fetch(`/api/questions?${params.toString()}`);
      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        setQuestion(null);
        setError("조건에 맞는 문제가 없습니다. 다른 유형을 선택하세요.");
        return;
      }
      setQuestion(data.questions[0]);
      setSelectedIndex(null);
      setSubmitted(false);
      setIsCorrect(null);
      setStartedAt(Date.now());
    } catch (fetchError) {
      setError("문제를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [mode, tags, sessionId]);

  const handleSubmit = async () => {
    if (!question || selectedIndex === null) return;
    const correct = selectedIndex === question.answerIndex;
    setSubmitted(true);
    setIsCorrect(correct);
    const timeMs = Date.now() - startedAt;
    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: question.id,
        selectedIndex,
        isCorrect: correct,
        timeMs
      })
    });
    setLastResult(correct ? "정답" : "오답");
  };

  const copyQuestion = async () => {
    if (!question) return;
    const tagsLabel = question.tags.join(", ") || "-";
    const answerLetter = String.fromCharCode(65 + question.answerIndex);
    const markdown = `### 오답 [${new Date().toISOString().slice(0, 10)}] [${tagsLabel}]
Q: ${question.stem}
A) ${question.choices[0]}
B) ${question.choices[1]}
C) ${question.choices[2]}
D) ${question.choices[3]}
정답: ${answerLetter}
해설: ${question.explanation}`;
    await navigator.clipboard.writeText(markdown);
    setLastResult("오답 복사 완료");
  };

  const answerLetter = useMemo(() => {
    if (!question) return "";
    return String.fromCharCode(65 + question.answerIndex);
  }, [question]);

  if (loading) {
    return <div className="rounded-xl bg-white p-6 shadow">문제를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!question) {
    return <div className="rounded-xl bg-white p-6 shadow">표시할 문제가 없습니다.</div>;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {question.type}
        </span>
        <span className="text-xs text-slate-500">난이도 {question.difficulty}</span>
      </div>
      <h2 className="mt-4 text-lg font-semibold">{question.stem}</h2>
      <div className="mt-4 grid gap-2">
        {question.choices.map((choice, index) => (
          <button
            key={choice}
            type="button"
            disabled={submitted}
            onClick={() => setSelectedIndex(index)}
            className={clsx(
              "rounded-lg border px-4 py-2 text-left text-sm",
              selectedIndex === index && "border-blue-500 bg-blue-50",
              submitted && index === question.answerIndex && "border-green-500 bg-green-50",
              submitted && selectedIndex === index && selectedIndex !== question.answerIndex && "border-red-500 bg-red-50"
            )}
          >
            <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {choice}
          </button>
        ))}
      </div>

      {submitted && (
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <p className="font-semibold text-slate-700">{isCorrect ? "정답입니다!" : "틀렸습니다."}</p>
          <p className="mt-2 text-sm"><strong>정답:</strong> {answerLetter}</p>
          <p className="mt-2 text-sm"><strong>해설:</strong> {question.explanation}</p>
          <p className="mt-2 text-xs text-slate-500">태그: {question.tags.join(", ")}</p>
        </div>
      )}

      {showControls && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={selectedIndex === null || submitted}
            onClick={handleSubmit}
          >
            정답 확인
          </button>
          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
            onClick={fetchQuestion}
          >
            다음 문제
          </button>
          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm"
            onClick={copyQuestion}
            disabled={!submitted || isCorrect}
          >
            오답 복사
          </button>
          {lastResult && <span className="text-xs text-slate-500">{lastResult}</span>}
        </div>
      )}
    </div>
  );
}
