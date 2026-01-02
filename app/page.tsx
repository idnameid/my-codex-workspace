import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">토익 문법 퀴즈</h1>
        <p className="mt-3 text-slate-600">
          Grammar Tree 기반 필터링으로 약한 유형을 집중 학습하세요. 기본 모드는 종합이며, 유형선택 모드로
          원하는 태그만 골라 연습할 수 있습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/practice" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            빠른 연습 시작
          </Link>
          <Link href="/review" className="rounded-lg border px-4 py-2 text-sm font-semibold">
            오답 리뷰 보기
          </Link>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-lg font-semibold">이용 흐름</h2>
        <ol className="mt-4 grid gap-3 text-sm text-slate-600">
          <li>1. 연습에서 종합 또는 유형선택을 고르고 세션을 시작합니다.</li>
          <li>2. 문제 풀이 후 오답 복사/세션 오답 전체 복사를 할 수 있습니다.</li>
          <li>3. 리뷰 페이지에서 세션별 오답을 내려받고 복습합니다.</li>
        </ol>
      </section>
    </div>
  );
}
