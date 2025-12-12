# API Client 리팩토링 문서

## 📋 개요

API 클라이언트를 **axios 기반**과 **fetch 기반**으로 명확히 분리하여, 각각의 환경(Client/Server)에 최적화된 구조로 리팩토링했습니다.

## 🎯 문제점

기존에는 `ServerApiClient`가 `BaseApiClient`를 상속받고 있었으나:

- `BaseApiClient`는 **axios 기반**
- `ServerApiClient`는 **fetch 사용**이 필요
- 불필요한 axios 의존성 및 타입 충돌 발생

## ✨ 해결 방안

### 아키텍처 개선

```
IApiClient (공통 인터페이스)
├── BaseApiClient (axios 전용)
│   └── ClientApiClient
└── BaseFetchApiClient (fetch 전용)
    └── ServerApiClient
```

## 📁 변경된 파일

### 1. ✅ 새로 생성된 파일

#### `i-api-client.ts`

- **목적**: API 클라이언트의 공통 인터페이스 정의
- **내용**: `request()`, `makeRequestConfig()` 메서드 선언
- **효과**: axios/fetch 구현체와 무관하게 일관된 API 제공

```typescript
export interface IApiClient {
	request<T>(config: any, token: string | null): Promise<ApiResponse<T>>;
	makeRequestConfig(endpoint: string, config: ApiRequestConfig): any;
}
```

#### `base-fetch-api-client.ts`

- **목적**: Fetch 기반 API 클라이언트의 베이스 클래스
- **기능**:
  - `executeFetchRequest()`: fetch 요청 실행 및 에러 처리
  - 기본 헤더, baseURL, timeout 설정
  - JSON/Text 응답 자동 처리
  - 네트워크 에러 핸들링

### 2. 🔄 수정된 파일

#### `server-api-client.ts`

**변경 전:**

```typescript
class ServerApiClient extends BaseApiClient {
	// axios 관련 타입 사용 (AxiosResponse, AxiosError)
	// executeRequest() 사용 (axios 기반)
}
```

**변경 후:**

```typescript
class ServerApiClient extends BaseFetchApiClient {
	// fetch 관련 타입 사용 (Response, RequestInit)
	// executeFetchRequest() 사용 (fetch 기반)
	// 인터셉터: #requestInterceptor, #responseInterceptor, #errorInterceptor
}
```

**주요 개선사항:**

- ✅ axios 의존성 완전 제거
- ✅ fetch API 네이티브 사용
- ✅ Next.js 서버 컴포넌트 최적화
- ✅ 싱글톤 인스턴스명 변경: `clientAPI` → `serverAPI`

#### `base-axios-client.ts`

**추가된 내용:**

```typescript
export class BaseApiClient implements IApiClient {
	// IApiClient 인터페이스 구현
	async request<T>(config: AxiosRequestConfig, token: string | null): Promise<ApiResponse<T>>;
	makeRequestConfig(endpoint: string, config: any): any;
}
```

**주요 개선사항:**

- ✅ `IApiClient` 인터페이스 구현
- ✅ 공통 API 준수
- ✅ 기존 axios 기능 유지

#### `server-api.ts`

**변경 전:**

```typescript
export async function serverApi<T>(
	endpoint: string,
	config: ServerApiRequestConfig = {},
	nextConfig: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	const response = await callApi<T>(endpoint, { ...config, apiCallType: 'server' }, nextConfig);
	return response;
}
```

**변경 후:**

```typescript
export async function serverApi<T>(
	endpoint: string,
	config: ServerApiRequestConfig = {},
	token: string | null = null,
): Promise<ApiResponse<T>> {
	const requestConfig = serverAPI.makeRequestConfig(endpoint, config);
	const response = await serverAPI.request<T>(requestConfig, token);
	return response;
}
```

**주요 개선사항:**

- ✅ `serverAPI` 인스턴스 직접 사용
- ✅ 토큰 인증 지원 추가
- ✅ 더 간결한 코드 구조

## 🚀 사용 방법

### Client 환경 (axios 사용)

```typescript
import { clientAPI } from '@fetch/client-api-client';

// GET 요청
const config = clientAPI.makeRequestConfig('/api/users', {
	method: 'GET',
	params: { page: 1 },
});
const response = await clientAPI.request(config, token);
```

### Server 환경 (fetch 사용)

```typescript
import { serverApi } from '@fetch/server-api';

// GET 요청
const response = await serverApi('/api/users', {
	method: 'GET',
	params: { page: 1 },
});

// POST 요청 with 캐싱
const response = await serverApi(
	'/api/users',
	{
		method: 'POST',
		body: { name: 'John' },
		cache: 'no-store',
	},
	token,
);
```

## 📊 비교표

| 항목            | 변경 전                 | 변경 후                        |
| --------------- | ----------------------- | ------------------------------ |
| **구조**        | BaseApiClient 단일 상속 | IApiClient 기반 분리           |
| **Server**      | axios (불필요한 의존성) | fetch (네이티브)               |
| **Client**      | axios                   | axios (유지)                   |
| **타입 안정성** | 타입 충돌               | 명확한 타입 분리               |
| **확장성**      | 제한적                  | 다른 HTTP 클라이언트 추가 용이 |

## ✅ 장점

1. **명확한 책임 분리**: axios와 fetch가 각각의 베이스 클래스로 분리
2. **타입 안정성**: 더 이상 axios 타입이 fetch 환경에 혼입되지 않음
3. **불필요한 의존성 제거**: Server 환경에서 axios 코드 완전 제거
4. **확장성**: 새로운 HTTP 클라이언트 추가 시 IApiClient만 구현하면 됨
5. **코드 가독성**: 각 클래스의 역할이 명확해짐

## 🔍 테스트 체크리스트

- [ ] Client 환경에서 axios 기반 API 호출 정상 동작
- [ ] Server 환경에서 fetch 기반 API 호출 정상 동작
- [ ] 인터셉터 정상 동작 (request/response/error)
- [ ] 토큰 인증 정상 처리
- [ ] 에러 핸들링 정상 동작
- [ ] 캐시 옵션 정상 동작 (Server)

## 📝 향후 개선 사항

1. **인터셉터 통합**: fetch 인터셉터를 더 효과적으로 활용
2. **타입 강화**: ApiRequestConfig 타입을 axios/fetch용으로 분리
3. **모니터링**: 요청/응답 로깅 개선
4. **재시도 로직**: 네트워크 에러 시 자동 재시도 추가

---

**작성일**: 2025-12-12  
**작성자**: AI Assistant  
**버전**: 1.0.0
