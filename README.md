# TOEIC Grammar Quiz

Next.js(App Router) + TypeScript + Tailwind + Prisma + SQLite 기반 토익 문법 퀴즈 앱입니다.

## 기능
- 종합 모드: 모든 문법 태그에서 랜덤 출제
- 유형선택 모드: Grammar Tree 태그 선택 후 해당 태그만 출제
- 오답 복사/다운로드: 세션 오답을 Markdown/CSV로 복사 및 저장

## 준비 사항
- Node.js 18 이상
- npm

## 설치 및 실행
```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

### 접속
- http://localhost:3000

## Prisma
- `prisma/schema.prisma`에 데이터 모델 정의
- `data/seed_questions.json` 기반으로 시드 데이터 삽입

## 스크립트
- `npm run dev`: 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 실행
- `npm run seed`: 시드 데이터 삽입

