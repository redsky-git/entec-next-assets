This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# 폴더구조 생각
```sh
next-project/
├─ src/
│  ├─ app/                    # Next.js App Router
│  │  ├─ layout.tsx           # 루트 레이아웃
│  │  ├─ page.tsx             # 홈페이지 (domains/home/pages)
│  │  ├─ globals.css          # 전역 스타일
│  │  ├─ (routes)/            # 라우트 그룹 (URL에 영향 없음)
│  │  │  ├─ home/
│  │  │  │  └─ page.tsx
│  │  │  ├─ example/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]/
│  │  │  │     └─ page.tsx
│  │  │  └─ ...
│  │  └─ api/                 # API Routes (선택사항)
│  │     └─ example/
│  │        └─ route.ts
│  │
│  ├─ domains/                # 기존 도메인 구조 유지
│  │  ├─ home/
│  │  │  ├─ api/              # API 호출 함수
│  │  │  ├─ common/           # 도메인 공통 함수
│  │  │  ├─ components/       # 도메인 전용 컴포넌트
│  │  │  ├─ hooks/            # 도메인 전용 hooks (구 store 일부)
│  │  │  ├─ store/            # 상태 관리 (zustand/redux)
│  │  │  └─ types/            # 도메인 타입 정의
│  │  │
│  │  ├─ example/
│  │  │  ├─ api/
│  │  │  ├─ common/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ store/
│  │  │  └─ types/
│  │  └─ ...
│  │
│  ├─ shared/                 # 도메인 간 공유 코드
│  │  ├─ components/          # 공유 컴포넌트
│  │  ├─ hooks/               # 공유 hooks
│  │  ├─ utils/               # 공유 유틸리티
│  │  └─ types/               # 공유 타입
│  │
│  ├─ core/                   # 기존 app 폴더 → core로 변경
│  │  ├─ api/                 # API 클라이언트 설정
│  │  ├─ common/              # 전역 공통 함수
│  │  ├─ components/          # 전역 공통 컴포넌트 (Header, Footer 등)
│  │  ├─ config/              # 앱 설정
│  │  ├─ providers/           # Context Providers
│  │  └─ types/               # 전역 타입
│  │
│  ├─ assets/                 # 정적 리소스
│  │  ├─ styles/              # CSS/SCSS 파일
│  │  ├─ fonts/               # 폰트 파일
│  │  └─ images/              # 이미지 (일부는 public으로)
│  │
│  └─ middleware.ts           # Next.js 미들웨어
│
├─ public/                    # 정적 파일 (이미지, 아이콘 등)
│  ├─ images/
│  └─ icons/
│
├─ @types/                    # 전역 타입 선언
├─ .env.local                 # 로컬 환경변수
├─ .env.development           # 개발 환경변수
├─ .env.production            # 프로덕션 환경변수
├─ next.config.js
├─ tsconfig.json
└─ package.json
```