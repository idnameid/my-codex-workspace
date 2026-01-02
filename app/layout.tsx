import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TOEIC Grammar Quiz",
  description: "TOEIC grammar practice with grammar tree filtering and review exports."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <div>
              <Link href="/" className="text-xl font-semibold">
                TOEIC Grammar Quiz
              </Link>
              <p className="text-sm text-slate-500">문법 유형 기반 문제 풀이</p>
            </div>
            <nav className="flex gap-4 text-sm text-slate-600">
              <Link href="/practice" className="hover:text-slate-900">연습</Link>
              <Link href="/test" className="hover:text-slate-900">테스트</Link>
              <Link href="/review" className="hover:text-slate-900">오답 리뷰</Link>
              <Link href="/admin" className="hover:text-slate-900">관리</Link>
            </nav>
          </div>
        </header>
        <main className="container py-10">{children}</main>
      </body>
    </html>
  );
}
