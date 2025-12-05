# Next.js + React Query API 통신 모듈 설치 가이드

## 1. 패키지 설치

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
# 또는
yarn add @tanstack/react-query @tanstack/react-query-devtools
# 또는
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

## 2. 프로젝트 구조

```
src/
├── lib/
│   └── api/
│       ├── base-api-client.ts          # 기존 파일
│       ├── client-api-client.ts        # 기존 파일 (주석 해제 필요)
│       ├── query-client-config.ts      # React Query 설정
│       ├── QueryProvider.tsx           # Provider 컴포넌트
│       ├── api-endpoints.ts            # API 엔드포인트 상수
│       ├── query-keys.ts               # Query Key 관리
│       ├── use-api-query.ts            # Query 커스텀 훅
│       └── use-api-mutation.ts         # Mutation 커스텀 훅
├── app/
│   └── layout.tsx                      # QueryProvider 통합
└── types/
    └── common.ts                       # 타입 정의
```

## 3. client-api-client.ts 수정 필요

현재 `client-api-client.ts`에서 POST, PUT, PATCH, DELETE 메서드가 주석처리되어 있습니다.
Mutation을 사용하려면 주석을 해제해야 합니다:

```typescript
async post<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: endpoint,
    data: body,
    headers: options?.headers,
    timeout: options?.timeout,
  };

  return this.executeRequest<T>(config, null);
}

// PUT, PATCH, DELETE도 동일하게 주석 해제
```

## 4. 환경변수 설정 (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 5. 사용 방법

### 5.1 Query 사용 (데이터 조회)

```typescript
import { useApiQuery } from '@/lib/api/use-api-query';
import { queryKeys } from '@/lib/api/query-keys';
import { API_ENDPOINTS } from '@/lib/api/api-endpoints';

function UserProfile() {
  const { data, isLoading, error } = useApiQuery<User>(
    queryKeys.user.profile(),
    API_ENDPOINTS.USER.GET_PROFILE
  );

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;

  return <div>{data?.name}</div>;
}
```

### 5.2 Mutation 사용 (데이터 생성/수정/삭제)

```typescript
import { useApiMutation } from '@/lib/api/use-api-mutation';
import { queryKeys } from '@/lib/api/query-keys';
import { API_ENDPOINTS } from '@/lib/api/api-endpoints';

function CreatePost() {
  const mutation = useApiMutation<Post, CreatePostRequest>(
    API_ENDPOINTS.POST.CREATE,
    {
      method: 'POST',
      invalidateKeys: [queryKeys.post.lists()],
      onSuccess: () => alert('생성 완료!'),
    }
  );

  const handleSubmit = (data: CreatePostRequest) => {
    mutation.mutate(data);
  };

  return <button onClick={() => handleSubmit({ title: '제목', content: '내용' })}>
    {mutation.isPending ? '생성중...' : '생성'}
  </button>;
}
```

## 6. 주요 기능

### ✅ 자동 캐싱 및 상태 관리

- React Query가 서버 상태를 자동으로 캐싱하고 관리합니다

### ✅ 자동 리페칭

- 윈도우 포커스, 네트워크 재연결 시 자동으로 데이터를 최신화합니다

### ✅ 낙관적 업데이트

- `useOptimisticMutation`을 사용하여 즉각적인 UI 업데이트가 가능합니다

### ✅ 타입 안전성

- TypeScript를 통해 완전한 타입 안전성을 보장합니다

### ✅ 개발자 도구

- React Query Devtools로 쿼리 상태를 시각적으로 확인할 수 있습니다

## 7. 고급 기능

### Prefetching (사전 데이터 로드)

```typescript
import { getQueryClient } from '@/lib/api/query-client-config';

// 서버 컴포넌트나 라우트 핸들러에서 사용
const queryClient = getQueryClient();
await queryClient.prefetchQuery({
	queryKey: queryKeys.post.detail(1),
	queryFn: () => fetchPostDetail(1),
});
```

### 조건부 쿼리

```typescript
const { data } = useApiQuery(queryKeys.user.detail(userId), API_ENDPOINTS.USER.GET_DETAIL(userId), {
	enabled: !!userId, // userId가 있을 때만 실행
});
```

### 무한 스크롤 (Infinite Query)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
	queryKey: queryKeys.post.lists(),
	queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
	getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

## 8. 트러블슈팅

### Q: "POST method not implemented yet" 에러가 발생합니다

A: `client-api-client.ts`의 POST, PUT, PATCH, DELETE 메서드 주석을 해제하세요.

### Q: CORS 에러가 발생합니다

A: API Routes를 사용하거나, Next.js 미들웨어에서 CORS 설정을 추가하세요.

### Q: 쿼리가 자동으로 리페칭되지 않습니다

A: `query-client-config.ts`의 `refetchOnWindowFocus` 설정을 확인하세요.

## 9. 참고 자료

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Axios 공식 문서](https://axios-http.com/)
