"use client";

import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import TagTree from "@/components/TagTree";
import { tagTree, flattenTags } from "@/lib/tagTree";

const sessionKey = "toeic-session-test";

export default function TestPage() {
  const [mode, setMode] = useState<"all" | "tags">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tags = flattenTags(tagTree).filter((node) => node.children === undefined);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tag) => tag !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">테스트 모드</h1>
        <p className="mt-2 text-sm text-slate-600">종합/유형선택 모드로 문제를 풀고 결과를 확인하세요.</p>
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
          <p className="mt-2 text-sm text-slate-600">선택한 태그 중 하나라도 포함된 문제가 출제됩니다.</p>
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
    </div>
  );
}
