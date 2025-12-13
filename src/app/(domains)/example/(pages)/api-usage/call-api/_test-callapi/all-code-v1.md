Next.js + TypeScript 프로젝트를 위한 API 통신 공통 모듈을 설계해드리겠습니다.완성된 API 통신 공통 모듈입니다! 주요 특징을 설명드리겠습니다:

## 🎯 핵심 설계 포인트

### 1. **단일 공통 함수 제공**

- `clientApi()` - 클라이언트용 API 호출
- `serverApi()` - 서버 액션용 API 호출
- 매번 함수를 만들 필요 없이 하나의 함수로 모든 API 호출 처리

### 2. **간편한 사용법**

```typescript
// Client에서
const users = await clientApi({ url: '/api/users', method: 'GET' });

// Server Action에서
const users = await serverApi({ url: '/api/users', method: 'GET' });
```

### 3. **React Query 통합**

- `useApiQuery` - GET 요청용
- `useApiMutation` - POST/PUT/DELETE용
- 자동 캐싱, 리페칭, 낙관적 업데이트 지원

### 4. **체계적인 Query Key 관리**

- 도메인별로 계층적 구조
- 자동 완성과 타입 안전성 보장

### 5. **DDD 패턴 적용**

```
(domains)/
  user/
    api/
      queries.ts  - Client용 React Query 훅
      actions.ts  - Server Action 함수
```

### 6. **Axios 기반**

- 인터셉터로 토큰 자동 주입
- 에러 핸들링 중앙화
- 재사용 가능한 설정

## 📦 설치 필요 패키지

```bash
npm install axios @tanstack/react-query
```

## 🚀 화면 개발자 사용 방법

**Client Component:**

```typescript
const { data, isLoading } = useUserList();
```

**Server Component:**

```typescript
const users = await getUserList();
```

**Form 제출:**

```typescript
const createMutation = useCreateUser();
createMutation.mutate({ name: 'John' });
```

매우 심플하고 직관적인 API를 제공하면서도, 확장성과 유지보수성을 모두 고려한 설계입니다! 🎉

/\*\*

- 프로젝트 폴더 구조
-
- src/
- ├── lib/
- │ ├── api/
- │ │ ├── client.ts # Axios 클라이언트 설정
- │ │ ├── server-action.ts # Server Action 공통 함수
- │ │ ├── client-api.ts # Client API 공통 함수
- │ │ ├── query-keys.ts # React Query Key 관리
- │ │ └── types.ts # API 타입 정의
- │ └── hooks/
- │ └── use-api.ts # React Query 커스텀 훅
- ├── app/
- │ ├── api/
- │ │ └── [...path]/
- │ │ └── route.ts # API Routes (프록시)
- │ └── (domains)/
- │ ├── user/
- │ │ ├── api/
- │ │ │ ├── queries.ts # 도메인별 Query 정의
- │ │ │ └── actions.ts # 도메인별 Server Action
- │ │ ├── components/
- │ │ └── page.tsx
- │ └── product/
- │ ├── api/
- │ │ ├── queries.ts
- │ │ └── actions.ts
- │ ├── components/
- │ └── page.tsx
- └── types/
-     └── api.ts                     # 공통 API 타입
  \*/

// ============================================================================
// 1. lib/api/types.ts - 공통 타입 정의
// ============================================================================

export interface ApiConfig {
url: string;
method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
params?: Record<string, any>;
data?: any;
headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
success: boolean;
data: T;
message?: string;
error?: string;
}

export interface PaginatedResponse<T> {
content: T[];
totalElements: number;
totalPages: number;
page: number;
size: number;
}

// ============================================================================
// 2. lib/api/client.ts - Axios 클라이언트 설정
// ============================================================================

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
private client: AxiosInstance;

constructor() {
this.client = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
timeout: 30000,
headers: {
'Content-Type': 'application/json',
},
});

    this.setupInterceptors();

}

private setupInterceptors() {
// Request 인터셉터
this.client.interceptors.request.use(
(config) => {
// 토큰이 있으면 헤더에 추가
if (typeof window !== 'undefined') {
const token = localStorage.getItem('accessToken');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
}
return config;
},
(error) => Promise.reject(error)
);

    // Response 인터셉터
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        // 401 에러 처리 (토큰 만료)
        if (error.response?.status === 401) {
          // 토큰 갱신 로직 추가 가능
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

}

async request<T = any>(config: ApiConfig): Promise<T> {
const axiosConfig: AxiosRequestConfig = {
url: config.url,
method: config.method || 'GET',
params: config.params,
data: config.data,
headers: config.headers,
};

    return this.client.request<any, T>(axiosConfig);

}

// 서버 사이드용 (토큰을 직접 전달)
async requestFromServer<T = any>(
config: ApiConfig,
token?: string
): Promise<T> {
const axiosConfig: AxiosRequestConfig = {
url: config.url,
method: config.method || 'GET',
params: config.params,
data: config.data,
headers: {
...config.headers,
...(token && { Authorization: `Bearer ${token}` }),
},
};

    return this.client.request<any, T>(axiosConfig);

}
}

export const apiClient = new ApiClient();

// ============================================================================
// 3. lib/api/server-action.ts - Server Action 공통 함수
// ============================================================================

'use server';

import { cookies } from 'next/headers';
import { apiClient } from './client';
import type { ApiConfig } from './types';

/\*\*

- Server Action에서 사용하는 공통 API 호출 함수
  \*/
  export async function serverApi<T = any>(config: ApiConfig): Promise<T> {
  try {
  // 쿠키에서 토큰 가져오기
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

      const result = await apiClient.requestFromServer<T>(config, token);
      return result;

  } catch (error: any) {
  console.error('Server API Error:', error);
  throw new Error(error.response?.data?.message || 'API 호출 실패');
  }
  }

// ============================================================================
// 4. lib/api/client-api.ts - Client API 공통 함수
// ============================================================================

'use client';

import { apiClient } from './client';
import type { ApiConfig } from './types';

/\*\*

- Client에서 사용하는 공통 API 호출 함수
  \*/
  export async function clientApi<T = any>(config: ApiConfig): Promise<T> {
  try {
  const result = await apiClient.request<T>(config);
  return result;
  } catch (error: any) {
  console.error('Client API Error:', error);
  throw new Error(error.response?.data?.message || 'API 호출 실패');
  }
  }

// ============================================================================
// 5. lib/api/query-keys.ts - Query Key 관리
// ============================================================================

/\*\*

- React Query Key 관리 팩토리
  \*/
  export const queryKeys = {
  // User 도메인
  user: {
  all: ['user'] as const,
  lists: () => [...queryKeys.user.all, 'list'] as const,
  list: (filters: any) => [...queryKeys.user.lists(), filters] as const,
  details: () => [...queryKeys.user.all, 'detail'] as const,
  detail: (id: string | number) => [...queryKeys.user.details(), id] as const,
  },

// Product 도메인
product: {
all: ['product'] as const,
lists: () => [...queryKeys.product.all, 'list'] as const,
list: (filters: any) => [...queryKeys.product.lists(), filters] as const,
details: () => [...queryKeys.product.all, 'detail'] as const,
detail: (id: string | number) => [...queryKeys.product.details(), id] as const,
},

// 도메인별로 확장 가능
// order: { ... },
// payment: { ... },
};

// ============================================================================
// 6. lib/hooks/use-api.ts - React Query 커스텀 훅
// ============================================================================

'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { clientApi } from '../api/client-api';
import type { ApiConfig } from '../api/types';

/\*\*

- GET 요청용 커스텀 훅
  \*/
  export function useApiQuery<T = any>(
  queryKey: readonly unknown[],
  config: ApiConfig,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
  ) {
  return useQuery<T>({
  queryKey,
  queryFn: () => clientApi<T>(config),
  ...options,
  });
  }

/\*\*

- POST/PUT/DELETE 요청용 커스텀 훅
  \*/
  export function useApiMutation<TData = any, TVariables = any>(
  config: Omit<ApiConfig, 'data'>,
  options?: UseMutationOptions<TData, Error, TVariables>
  ) {
  const queryClient = useQueryClient();

return useMutation<TData, Error, TVariables>({
mutationFn: (variables: TVariables) =>
clientApi<TData>({ ...config, data: variables }),
onSuccess: (data, variables, context) => {
// 기본적으로 모든 쿼리 무효화 (필요시 커스터마이징)
queryClient.invalidateQueries();
options?.onSuccess?.(data, variables, context);
},
...options,
});
}

// ============================================================================
// 7. app/(domains)/user/api/queries.ts - 도메인별 Query 정의 예시
// ============================================================================

'use client';

import { useApiQuery, useApiMutation } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/api/query-keys';

// 사용자 목록 조회
export function useUserList(params?: { page?: number; size?: number }) {
return useApiQuery(
queryKeys.user.list(params),
{
url: '/api/users',
method: 'GET',
params,
}
);
}

// 사용자 상세 조회
export function useUserDetail(userId: string) {
return useApiQuery(
queryKeys.user.detail(userId),
{
url: `/api/users/${userId}`,
method: 'GET',
},
{
enabled: !!userId, // userId가 있을 때만 실행
}
);
}

// 사용자 생성
export function useCreateUser() {
return useApiMutation({
url: '/api/users',
method: 'POST',
});
}

// 사용자 수정
export function useUpdateUser(userId: string) {
return useApiMutation({
url: `/api/users/${userId}`,
method: 'PUT',
});
}

// 사용자 삭제
export function useDeleteUser() {
return useApiMutation({
url: '/api/users',
method: 'DELETE',
});
}

// ============================================================================
// 8. app/(domains)/user/api/actions.ts - 도메인별 Server Action 예시
// ============================================================================

'use server';

import { serverApi } from '@/lib/api/server-action';
import { revalidatePath } from 'next/cache';

// 사용자 목록 조회 (Server Component용)
export async function getUserList(params?: { page?: number; size?: number }) {
return serverApi({
url: '/api/users',
method: 'GET',
params,
});
}

// 사용자 상세 조회 (Server Component용)
export async function getUserDetail(userId: string) {
return serverApi({
url: `/api/users/${userId}`,
method: 'GET',
});
}

// 사용자 생성 (Server Action)
export async function createUser(data: any) {
const result = await serverApi({
url: '/api/users',
method: 'POST',
data,
});

revalidatePath('/users'); // 캐시 무효화
return result;
}

// 사용자 수정 (Server Action)
export async function updateUser(userId: string, data: any) {
const result = await serverApi({
url: `/api/users/${userId}`,
method: 'PUT',
data,
});

revalidatePath(`/users/${userId}`);
return result;
}

// 사용자 삭제 (Server Action)
export async function deleteUser(userId: string) {
const result = await serverApi({
url: `/api/users/${userId}`,
method: 'DELETE',
});

revalidatePath('/users');
return result;
}

// ============================================================================
// 9. app/(domains)/user/page.tsx - 사용 예시
// ============================================================================

'use client';

import { useUserList, useCreateUser } from './api/queries';

export default function UserPage() {
// Client에서 데이터 조회 (React Query)
const { data: users, isLoading } = useUserList({ page: 0, size: 10 });

// Mutation 사용
const createMutation = useCreateUser();

const handleCreate = () => {
createMutation.mutate({
name: 'John Doe',
email: 'john@example.com',
}, {
onSuccess: () => {
alert('사용자가 생성되었습니다!');
},
onError: (error) => {
alert(`오류: ${error.message}`);
},
});
};

if (isLoading) return <div>로딩중...</div>;

return (
<div>
<h1>사용자 목록</h1>
<button onClick={handleCreate}>사용자 추가</button>
<ul>
{users?.content?.map((user: any) => (
<li key={user.id}>{user.name}</li>
))}
</ul>
</div>
);
}

// ============================================================================
// 10. app/(domains)/user/server-page.tsx - Server Component 사용 예시
// ============================================================================

import { getUserList } from './api/actions';

export default async function UserServerPage() {
// Server Component에서 직접 데이터 조회
const users = await getUserList({ page: 0, size: 10 });

return (
<div>
<h1>사용자 목록 (Server)</h1>
<ul>
{users.content?.map((user: any) => (
<li key={user.id}>{user.name}</li>
))}
</ul>
</div>
);
}
