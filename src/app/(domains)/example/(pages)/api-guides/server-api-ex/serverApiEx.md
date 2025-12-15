## 🔄 실제 사용 패턴

### 패턴 1: Route Handler에서 외부 API 프록시

```17:28:src/app/(domains)/example/api/users/route.ts
const response = await serverApi<any[]>(
	'https://koreanjson.com/users',
	{
		method: 'GET',
	},
	{
		revalidate: 0, // 항상 최신 데이터 fetch
		tags: ['users', 'financial'],
	},
);
```

**흐름:**

```
Client Component (useApi) → Route Handler → serverApi → 외부 API
```

이 패턴의 장점:

1. 클라이언트에서는 같은 도메인의 Route Handler만 호출 → CORS 없음
2. 서버에서 외부 API 호출 → 민감 정보 보호
3. 캐싱 옵션 활용 가능

### 패턴 2: Server Component에서 직접 사용

```typescript
// app/posts/page.tsx (Server Component)
import { serverApi } from '@/core/common/api/server-api';

export default async function PostsPage() {
  const { data: posts } = await serverApi<Post[]>('/api/posts',
    { method: 'GET' },
    { revalidate: 60 }  // 60초마다 재검증
  );

  return (
    <ul>
      {posts?.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

---

## 📊 `serverApi` vs `useApi` 비교 요약

| 특성                | `serverApi`                                    | `useApi`                  |
| ------------------- | ---------------------------------------------- | ------------------------- |
| **실행 환경**       | Node.js 서버                                   | 브라우저                  |
| **사용 위치**       | Server Component, Route Handler, Server Action | Client Component          |
| **HTTP 클라이언트** | fetch                                          | axios (내부적으로)        |
| **CORS**            | 없음                                           | 발생 가능                 |
| **캐싱**            | Next.js ISR/SSG 지원                           | React Query 캐싱          |
| **SEO**             | 최적화됨                                       | 불리함                    |
| **사용자 인터랙션** | 제한적                                         | 적합                      |
| **실시간 업데이트** | 제한적                                         | `refetch`, `enabled` 지원 |

---

## 💡 권장 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Component                        │
│                                                             │
│   useApi('@routes/example/api/users')  ← TanStack Query     │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (같은 도메인, CORS 없음)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Route Handler                            │
│            (src/app/.../api/users/route.ts)                │
│                                                             │
│   serverApi('https://external-api.com/users')               │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (서버에서 호출, 보안/캐싱)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    External API                             │
│              (https://external-api.com)                     │
└─────────────────────────────────────────────────────────────┘
```

이 아키텍처를 사용하면 **CORS 해결**, **보안 강화**, **캐싱 최적화**를 모두 달성할 수 있습니다.

```typescript
'use server';

import { ServerApiRequestConfig, ApiResponse } from '@app-types/common/app-api-types';
import { callApi } from '@fetch/api';

// ... JSDoc 생략 ...

export async function serverApi<T = any>(
	endpoint: string,
	config: ServerApiRequestConfig = {},
	nextConfig: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	const response = await callApi<T>(endpoint, { ...config, apiCallType: 'server' }, nextConfig);
	return response;
}
```

```typescript
const { data } = await serverApi(
	'/api/posts',
	{ method: 'GET' },
	{
		revalidate: 3600, // 1시간마다 재검증
		tags: ['posts'], // 태그 기반 캐시 무효화
	},
);
```

```typescript
const response = await serverApi<any[]>(
	'https://koreanjson.com/users',
	{
		method: 'GET',
	},
	{
		revalidate: 0, // 항상 최신 데이터 fetch
		tags: ['users', 'financial'],
	},
);
```

```plaintext
Client Component (useApi) → Route Handler → serverApi → 외부 API
```

```typescript
// app/posts/page.tsx (Server Component)
import { serverApi } from '@/core/common/api/server-api';

export default async function PostsPage() {
  const { data: posts } = await serverApi<Post[]>('/api/posts',
    { method: 'GET' },
    { revalidate: 60 }  // 60초마다 재검증
  );

  return (
    <ul>
      {posts?.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                     Client Component                        │
│                                                             │
│   useApi('@routes/example/api/users')  ← TanStack Query     │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (같은 도메인, CORS 없음)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Route Handler                            │
│            (src/app/.../api/users/route.ts)                │
│                                                             │
│   serverApi('https://external-api.com/users')               │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (서버에서 호출, 보안/캐싱)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    External API                             │
│              (https://external-api.com)                     │
└─────────────────────────────────────────────────────────────┘
```
