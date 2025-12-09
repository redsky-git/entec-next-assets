# Next.js API 통신 기술 선택 가이드

_Exported on 2025. 12. 9. at 14시 37분 58초 GMT+9 from Cursor (2.1.50)_

---

**User**

Next.js에서 API통신하는 공통 모듈을 만들것이다.

여러가지 상황이 있을것이다.

1. 클라이언트 > API 서버(get, put, delete, fetch, post)

2. server component > API 서버(get, put, delete, fetch, post)

api 통신하는 기술은 (react-query, route handlers, server actions)들이 있을것인데, 어떨때 어떤걸 써야하는지와 그 이유를 알려줘

---

**Cursor**

Next.js에서 API 통신 모듈을 만드실 때 각 기술의 사용 시점과 이유를 설명드리겠습니다.

현재 코드베이스를 확인했습니다. Next.js에서 API 통신 시 각 기술을 **언제, 왜** 사용해야 하는지 상황별로 정리해드리겠습니다.

## 📋 기술별 사용 시점 정리

### 1️⃣ **React Query (TanStack Query)**

**사용 상황: Client Component에서 동적 데이터 페칭**

```typescript
// ✅ 언제 사용하나요?
// - 클라이언트에서 실시간으로 변하는 데이터
// - 사용자 인터랙션에 따른 데이터 페칭
// - 캐싱, 자동 리페칭, 낙관적 업데이트 필요
// - Infinite scroll, Polling 등 복잡한 데이터 관리

'use client';
import { useQuery, useMutation } from '@tanstack/react-query';

// GET: 조회
function UserProfile() {
	const { data, isLoading } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => fetch(`/api/users/${userId}`).then((r) => r.json()),
		staleTime: 5 * 60 * 1000, // 5분간 캐시
	});
}

// POST/PUT/DELETE: 변경
function UpdateProfile() {
	const mutation = useMutation({
		mutationFn: (data) =>
			fetch('/api/users', {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
	});
}
```

**✨ 장점:**

- 캐싱, 중복 제거, 백그라운드 업데이트 자동
- Loading/Error 상태 관리 내장
- Optimistic Updates 쉬움
- DevTools로 디버깅 가능

**⚠️ 단점:**

- 번들 사이즈 증가 (~40KB)
- 학습 곡선 존재
- SSR 초기 데이터 전달이 복잡할 수 있음

---

### 2️⃣ **Route Handlers (API Routes)**

**사용 상황: BFF(Backend For Frontend) 패턴, 미들웨어 로직**

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ✅ 언제 사용하나요?
// - 외부 API 호출 시 인증 정보(토큰) 숨기기
// - CORS 우회
// - 여러 API를 하나로 합쳐서 응답
// - Rate limiting, 로깅 등 미들웨어 로직
// - 클라이언트에 민감한 정보 노출 방지

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  // 서버에서 외부 API 호출 (토큰 숨김)
  const response = await fetch(`${process.env.BACKEND_API}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`, // 클라이언트에 노출 안됨
    }
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // 여러 API 호출을 하나로 합침
  const [userData, accountData] = await Promise.all([
    fetch(`${process.env.BACKEND_API}/users`, { ... }),
    fetch(`${process.env.BACKEND_API}/accounts`, { ... }),
  ]);

  return NextResponse.json({ user: userData, account: accountData });
}
```

**✨ 장점:**

- 민감한 정보(API 키, 토큰) 숨김
- CORS 문제 해결
- 여러 API 조합 가능
- 서버 사이드 로깅/모니터링

**⚠️ 단점:**

- 추가 네트워크 홉 (지연 시간 증가)
- 서버 리소스 사용

---

### 3️⃣ **Server Actions**

**사용 상황: Form 제출, 데이터 변경(Mutation)**

```typescript
// app/actions/users.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// ✅ 언제 사용하나요?
// - Form 제출 (POST, PUT, DELETE)
// - 데이터 변경 후 캐시 무효화 필요
// - Progressive Enhancement (JS 없이도 동작)
// - 서버에서만 실행되어야 하는 로직

export async function updateUser(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');

  // 서버에서 직접 API 호출
  const response = await fetch(`${process.env.BACKEND_API}/users`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await cookies()).get('token')?.value}`,
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    return { error: '업데이트 실패' };
  }

  // 캐시 무효화
  revalidatePath('/dashboard');
  revalidateTag('users');

  return { success: true };
}

// Client에서 사용
'use client';
export function UserForm() {
  return (
    <form action={updateUser}>
      <input name="name" />
      <input name="email" />
      <button type="submit">저장</button>
    </form>
  );
}
```

**✨ 장점:**

- Form과 자연스럽게 통합
- 자동 캐시 무효화 (revalidatePath/Tag)
- Progressive Enhancement
- 서버 리소스 직접 접근 (DB, 파일 등)
- 타입 세이프

**⚠️ 단점:**

- GET 요청에는 부적합
- 복잡한 에러 처리
- 낙관적 업데이트가 복잡함

---

### 4️⃣ **Server Component에서 직접 fetch**

**사용 상황: SSR, 초기 페이지 로드 데이터**

```typescript
// app/dashboard/page.tsx (Server Component)

// ✅ 언제 사용하나요?
// - 페이지 로드 시 필요한 초기 데이터
// - SEO가 중요한 데이터
// - 정적 생성(SSG) 또는 증분 재생성(ISR)
// - 서버에서만 접근 가능한 리소스

export default async function DashboardPage() {
  // 서버에서 직접 fetch (캐싱 가능)
  const users = await fetch(`${process.env.BACKEND_API}/users`, {
    cache: 'force-cache', // SSG
    // next: { revalidate: 60 }, // ISR (60초마다)
    // cache: 'no-store', // SSR (매번 새로 가져옴)
  }).then(r => r.json());

  return (
    <div>
      <h1>사용자 목록</h1>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}
```

**✨ 장점:**

- SEO 최적화 (HTML에 데이터 포함)
- 초기 로딩 속도 빠름
- Next.js 자동 캐싱
- 서버 리소스 직접 접근

**⚠️ 단점:**

- 실시간 업데이트 불가
- 클라이언트 인터랙션 제한적

---

## 🎯 상황별 추천 패턴

### **1. 클라이언트 → API 서버**

| HTTP Method         | 상황        | 추천 기술              | 이유              |
| ------------------- | ----------- | ---------------------- | ----------------- |
| **GET**             | 실시간 조회 | React Query            | 캐싱, 자동 리페칭 |
| **GET**             | 초기 로드   | Server Component       | SEO, 초기 속도    |
| **POST/PUT/DELETE** | Form 제출   | Server Actions         | 자동 캐시 무효화  |
| **POST/PUT/DELETE** | 복잡한 UI   | React Query (mutation) | 낙관적 업데이트   |

### **2. Server Component → API 서버**

| 상황             | 추천 기술            | 예시               |
| ---------------- | -------------------- | ------------------ |
| 초기 데이터 로드 | 직접 fetch           | 블로그 포스트 목록 |
| 인증 필요        | 직접 fetch + cookies | 사용자 대시보드    |
| 데이터 변경      | Server Actions       | Form 제출          |

---

## 🏗️ 실전 아키텍처 추천

```typescript
// ============================================
// 구조: Layered Architecture
// ============================================

// 1. API Client Layer (공통 fetch 로직)
// src/lib/api-client.ts
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// 2. React Query Hooks (클라이언트용)
// src/hooks/use-users.ts
'use client';
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch('/api/users'),
  });
}

// 3. Server Actions (변경 작업)
// src/actions/users.ts
'use server';
export async function updateUser(data: UserData) {
  const result = await apiFetch('/users', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  revalidateTag('users');
  return result;
}

// 4. Server Component (초기 로드)
// src/app/users/page.tsx
export default async function UsersPage() {
  const users = await apiFetch('/users', { cache: 'force-cache' });
  return <UsersList initialData={users} />;
}
```

---

## ✅ 최종 결론

```typescript
// 📌 이렇게 사용하세요!

// Client Component: 실시간 데이터 조회
'use client';
const { data } = useQuery({ ... }); // ✅ React Query

// Client Component: 복잡한 Form
'use client';
const mutation = useMutation({ ... }); // ✅ React Query

// Server Component: 초기 페이지 데이터
const data = await fetch(...); // ✅ 직접 fetch

// Server Actions: 간단한 Form 제출
'use server';
export async function submitForm() { ... } // ✅ Server Actions

// Route Handlers: 외부 API 프록시 (BFF)
export async function GET() { ... } // ✅ Route Handlers
```

질문이나 특정 상황에 대한 더 자세한 설명이 필요하시면 말씀해주세요!

```typescript
// ✅ 언제 사용하나요?
// - 클라이언트에서 실시간으로 변하는 데이터
// - 사용자 인터랙션에 따른 데이터 페칭
// - 캐싱, 자동 리페칭, 낙관적 업데이트 필요
// - Infinite scroll, Polling 등 복잡한 데이터 관리

'use client';
import { useQuery, useMutation } from '@tanstack/react-query';

// GET: 조회
function UserProfile() {
	const { data, isLoading } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => fetch(`/api/users/${userId}`).then((r) => r.json()),
		staleTime: 5 * 60 * 1000, // 5분간 캐시
	});
}

// POST/PUT/DELETE: 변경
function UpdateProfile() {
	const mutation = useMutation({
		mutationFn: (data) =>
			fetch('/api/users', {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
	});
}
```

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ✅ 언제 사용하나요?
// - 외부 API 호출 시 인증 정보(토큰) 숨기기
// - CORS 우회
// - 여러 API를 하나로 합쳐서 응답
// - Rate limiting, 로깅 등 미들웨어 로직
// - 클라이언트에 민감한 정보 노출 방지

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  // 서버에서 외부 API 호출 (토큰 숨김)
  const response = await fetch(`${process.env.BACKEND_API}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`, // 클라이언트에 노출 안됨
    }
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // 여러 API 호출을 하나로 합침
  const [userData, accountData] = await Promise.all([
    fetch(`${process.env.BACKEND_API}/users`, { ... }),
    fetch(`${process.env.BACKEND_API}/accounts`, { ... }),
  ]);

  return NextResponse.json({ user: userData, account: accountData });
}
```

```typescript
// app/actions/users.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// ✅ 언제 사용하나요?
// - Form 제출 (POST, PUT, DELETE)
// - 데이터 변경 후 캐시 무효화 필요
// - Progressive Enhancement (JS 없이도 동작)
// - 서버에서만 실행되어야 하는 로직

export async function updateUser(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');

  // 서버에서 직접 API 호출
  const response = await fetch(`${process.env.BACKEND_API}/users`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await cookies()).get('token')?.value}`,
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    return { error: '업데이트 실패' };
  }

  // 캐시 무효화
  revalidatePath('/dashboard');
  revalidateTag('users');

  return { success: true };
}

// Client에서 사용
'use client';
export function UserForm() {
  return (
    <form action={updateUser}>
      <input name="name" />
      <input name="email" />
      <button type="submit">저장</button>
    </form>
  );
}
```

```typescript
// app/dashboard/page.tsx (Server Component)

// ✅ 언제 사용하나요?
// - 페이지 로드 시 필요한 초기 데이터
// - SEO가 중요한 데이터
// - 정적 생성(SSG) 또는 증분 재생성(ISR)
// - 서버에서만 접근 가능한 리소스

export default async function DashboardPage() {
  // 서버에서 직접 fetch (캐싱 가능)
  const users = await fetch(`${process.env.BACKEND_API}/users`, {
    cache: 'force-cache', // SSG
    // next: { revalidate: 60 }, // ISR (60초마다)
    // cache: 'no-store', // SSR (매번 새로 가져옴)
  }).then(r => r.json());

  return (
    <div>
      <h1>사용자 목록</h1>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}
```

```typescript
// ============================================
// 구조: Layered Architecture
// ============================================

// 1. API Client Layer (공통 fetch 로직)
// src/lib/api-client.ts
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// 2. React Query Hooks (클라이언트용)
// src/hooks/use-users.ts
'use client';
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch('/api/users'),
  });
}

// 3. Server Actions (변경 작업)
// src/actions/users.ts
'use server';
export async function updateUser(data: UserData) {
  const result = await apiFetch('/users', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  revalidateTag('users');
  return result;
}

// 4. Server Component (초기 로드)
// src/app/users/page.tsx
export default async function UsersPage() {
  const users = await apiFetch('/users', { cache: 'force-cache' });
  return <UsersList initialData={users} />;
}
```

```typescript
// 📌 이렇게 사용하세요!

// Client Component: 실시간 데이터 조회
'use client';
const { data } = useQuery({ ... }); // ✅ React Query

// Client Component: 복잡한 Form
'use client';
const mutation = useMutation({ ... }); // ✅ React Query

// Server Component: 초기 페이지 데이터
const data = await fetch(...); // ✅ 직접 fetch

// Server Actions: 간단한 Form 제출
'use server';
export async function submitForm() { ... } // ✅ Server Actions

// Route Handlers: 외부 API 프록시 (BFF)
export async function GET() { ... } // ✅ Route Handlers
```
