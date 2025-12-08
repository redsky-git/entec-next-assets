# React Query 핵심 개념 설명

## 1. 왜 useApiQuery와 useApiMutation으로 나뉘나요?

### 📖 Query vs Mutation의 근본적 차이

React Query는 **CQRS(Command Query Responsibility Segregation)** 패턴을 따릅니다.

#### **Query (조회)**

- **목적**: 데이터를 읽기만 함 (READ)
- **특징**: 서버 상태를 변경하지 않음
- **HTTP 메서드**: 주로 GET
- **부작용**: 없음 (멱등성 보장)

```typescript
// Query 예시
const { data } = useApiQuery(['users'], {
	url: '/api/users',
	method: 'GET',
});
```

#### **Mutation (변경)**

- **목적**: 데이터를 생성/수정/삭제 (CREATE/UPDATE/DELETE)
- **특징**: 서버 상태를 변경함
- **HTTP 메서드**: POST, PUT, DELETE, PATCH
- **부작용**: 있음 (서버 데이터가 변경됨)

```typescript
// Mutation 예시
const createMutation = useApiMutation({
	url: '/api/users',
	method: 'POST',
});

createMutation.mutate({ name: 'John' });
```

### 🎯 왜 나눠야 할까?

#### **1. 캐싱 전략이 완전히 다름**

**Query (useApiQuery)**

```typescript
// ✅ 자동으로 캐싱됨
// ✅ 같은 데이터를 여러 컴포넌트에서 요청하면 1번만 fetch
// ✅ 백그라운드에서 자동 리페칭
// ✅ stale/fresh 상태 관리

const { data } = useUserList(); // 캐시됨
const { data } = useUserList(); // 같은 데이터 재사용!
```

**Mutation (useApiMutation)**

```typescript
// ❌ 캐싱하면 안 됨 (매번 새로운 요청)
// ❌ 자동 실행되면 안 됨 (사용자 액션에만 반응)
// ✅ 성공 시 관련 Query 무효화하여 최신 데이터 가져옴

const createMutation = useCreateUser();
// 버튼 클릭할 때만 실행됨
createMutation.mutate({ name: 'John' });
```

#### **2. 실행 시점과 방식**

| | Query | Mutation |
|## 5. Query vs Mutation 실제 사용 케이스 비교

### 🔍 언제 Query를 쓰고, 언제 Mutation을 쓸까?

핵심은 **"읽기냐 쓰기냐"**가 아니라 **"서버 상태를 변경하느냐"**입니다.

#### **Query를 사용하는 경우**

```typescript
// ✅ 1. 자동 로딩: 페이지 접속 시 데이터 표시
function UserList() {
  const { data } = useUserList();
  return <div>{data?.map(...)}</div>;
}

// ✅ 2. 검색: 버튼 클릭 시 조회 (enabled: false + refetch)
function SearchUsers() {
  const [keyword, setKeyword] = useState('');
  const { data, refetch } = useApiQuery(
    ['users', 'search', keyword],
    { url: '/api/users/search', params: { keyword } },
    { enabled: false } // 자동 실행 막기
  );

  return (
    <>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={() => refetch()}>검색</button>
    </>
  );
}

// ✅ 3. 필터/정렬: 옵션 변경 시 자동 재조회
function ProductList() {
  const [sort, setSort] = useState('price');

  // sort가 변경되면 자동으로 다시 조회됨
  const { data } = useApiQuery(
    ['products', sort],
    { url: '/api/products', params: { sort } }
  );

  return (
    <>
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="price">가격순</option>
        <option value="name">이름순</option>
      </select>
      {data?.map(...)}
    </>
  );
}

// ✅ 4. 새로고침 버튼
function Dashboard() {
  const { data, refetch, isFetching } = useDashboardData();

  return (
    <>
      <button onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? '로딩 중...' : '새로고침'}
      </button>
      <div>{data}</div>
    </>
  );
}

// ✅ 5. 무한 스크롤
function InfiniteUserList() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(...);

  const handleScroll = () => {
    if (hasNextPage) {
      fetchNextPage(); // 스크롤 이벤트로 다음 페이지 로드
    }
  };

  return <div onScroll={handleScroll}>...</div>;
}
```

#### **Mutation을 사용하는 경우**

```typescript
// ✅ 1. 데이터 생성
function CreateUser() {
  const createMutation = useCreateUser();

  const handleSubmit = (data) => {
    createMutation.mutate(data); // 서버 상태 변경!
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ 2. 데이터 수정
function EditUser({ userId }) {
  const updateMutation = useUpdateUser(userId);

  const handleSave = (data) => {
    updateMutation.mutate(data); // 서버 상태 변경!
  };

  return <button onClick={handleSave}>저장</button>;
}

// ✅ 3. 데이터 삭제
function DeleteUserButton({ userId }) {
  const deleteMutation = useDeleteUser();

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(userId); // 서버 상태 변경!
    }
  };

  return <button onClick={handleDelete}>삭제</button>;
}

// ✅ 4. 좋아요/팔로우 (토글)
function LikeButton({ postId }) {
  const likeMutation = useLikePost();

  const handleLike = () => {
    likeMutation.mutate(postId); // 서버 상태 변경!
  };

  return <button onClick={handleLike}>❤️</button>;
}
```

### ⚠️ 헷갈리는 케이스 해결

#### **케이스 1: 검색 - Query vs Mutation?**

```typescript
// ❓ 검색은 GET 요청인데, 버튼 클릭으로 실행된다. 뭘 써야 할까?

// ✅ 정답: Query 사용 (서버 상태를 변경하지 않음)
function SearchProducts() {
  const [keyword, setKeyword] = useState('');

  const { data, refetch } = useApiQuery(
    ['products', 'search', keyword],
    { url: '/api/products/search', params: { keyword } },
    { enabled: false } // 버튼 클릭 시에만 실행
  );

  return (
    <>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={() => refetch()}>검색</button>
    </>
  );
}

// ❌ Mutation 사용하면 안 되는 이유:
// - 캐싱이 안 됨 (같은 검색어로 다시 검색하면 또 요청)
// - 뒤로가기 시 데이터가 사라짐
// - 여러 컴포넌트에서 같은 검색 결과를 공유할 수 없음
```

#### **케이스 2: 페이지네이션 - Query vs Mutation?**

```typescript
// ✅ 정답: Query 사용 (서버 상태를 변경하지 않음)
function UserList() {
  const [page, setPage] = useState(1);

  // page가 변경되면 자동으로 새로운 데이터 조회
  const { data } = useApiQuery(
    ['users', page],
    { url: '/api/users', params: { page } }
  );

  return (
    <>
      <div>{data?.content.map(...)}</div>
      <button onClick={() => setPage(page + 1)}>다음 페이지</button>
    </>
  );
}

// 또는 refetch 사용
function UserList() {
  const [page, setPage] = useState(1);

  const { data, refetch } = useApiQuery(
    ['users', page],
    { url: '/api/users', params: { page } }
  );

  const handleNextPage = () => {
    setPage(page + 1);
    // queryKey가 변경되어 자동으로 refetch됨
  };

  return <button onClick={handleNextPage}>다음</button>;
}
```

#### **케이스 3: 파일 다운로드 - Query vs Mutation?**

```typescript
// ✅ 정답: Mutation 사용
// 이유: 다운로드는 서버에 로그를 남기거나 카운트를 증가시킬 수 있음
// 또한 캐싱이 필요 없고, 버튼 클릭으로만 실행되어야 함

function DownloadButton({ fileId }) {
  const downloadMutation = useApiMutation({
    url: `/api/files/${fileId}/download`,
    method: 'POST' // 또는 GET이지만 로깅 목적
  });

  const handleDownload = async () => {
    const data = await downloadMutation.mutateAsync();
    // 파일 다운로드 처리
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.pdf';
    a.click();
  };

  return <button onClick={handleDownload}>다운로드</button>;
}
```

#### **케이스 4: 통계/리포트 생성 - Query vs Mutation?**

```typescript
// ✅ 정답: Mutation 사용
// 이유: 서버에서 무거운 연산을 수행하고 결과를 생성함

function GenerateReport() {
  const generateMutation = useApiMutation({
    url: '/api/reports/generate',
    method: 'POST'
  });

  const handleGenerate = () => {
    generateMutation.mutate({ year: 2024, month: 12 });
  };

  return (
    <>
      <button onClick={handleGenerate}>리포트 생성</button>
      {generateMutation.isLoading && <div>생성 중...</div>}
      {generateMutation.data && <div>완료!</div>}
    </>
  );
}
```

### 🎯 판단 기준 요약

| 체크리스트                 | Query | Mutation |
| -------------------------- | ----- | -------- |
| 서버 데이터를 변경하나?    | ❌    | ✅       |
| 캐싱이 필요한가?           | ✅    | ❌       |
| 같은 요청을 반복할 가능성? | ✅    | ❌       |
| 자동 리페칭이 필요한가?    | ✅    | ❌       |
| 멱등성이 보장되나?         | ✅    | ❌       |

**핵심 원칙**: HTTP 메서드보다는 **"서버 상태 변경 여부"**로 판단하세요!

---|---|---|
| **기본 동작** | 자동 실행 (마운트 시) | 수동 실행만 |
| **이벤트 실행** | ✅ 가능 (refetch 사용) | ✅ 가능 (mutate 사용) |
| **자동 리페칭** | ✅ 지원 (포커스, 인터벌) | ❌ 지원 안 함 |

```typescript
// Query - 기본: 자동 실행
function UserList() {
  const { data, refetch } = useUserList();
  // 📌 컴포넌트 마운트 시 자동 호출

  // ✅ 이벤트로도 실행 가능!
  const handleRefresh = () => {
    refetch(); // 수동으로 다시 조회
  };

  return (
    <div>
      <button onClick={handleRefresh}>새로고침</button>
      {data?.map(...)}
    </div>
  );
}

// Query - enabled: false로 수동 실행만 가능
function SearchUser() {
  const [keyword, setKeyword] = useState('');

  const { data, refetch } = useApiQuery(
    ['search', keyword],
    { url: '/api/users/search', params: { keyword } },
    { enabled: false } // 📌 자동 실행 비활성화
  );

  const handleSearch = () => {
    refetch(); // 검색 버튼 클릭 시에만 실행
  };

  return (
    <div>
      <input onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}

// Mutation - 항상 수동 실행
function CreateUserForm() {
  const createMutation = useCreateUser();

  const handleSubmit = (formData) => {
    createMutation.mutate(formData); // 📌 명시적 호출만 가능
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### **3. 상태 관리가 다름**

**Query 상태**

```typescript
const {
  data,           // 조회된 데이터
  isLoading,      // 처음 로딩 중
  isFetching,     // 백그라운드 리페칭 중
  isError,        // 에러 발생
  refetch         // 수동 리페치
} = useApiQuery(...);
```

**Mutation 상태**

```typescript
const {
  mutate,         // 실행 함수
  mutateAsync,    // Promise 반환 함수
  isLoading,      // 실행 중 (isPending)
  isSuccess,      // 성공
  isError,        // 실패
  data,           // 응답 데이터
  reset           // 상태 초기화
} = useApiMutation(...);
```

---

## 2. "Mutation"이라고 명명한 이유

### 📚 용어의 유래

**Mutation**은 프로그래밍에서 "상태를 변경한다"는 의미입니다.

#### **함수형 프로그래밍 관점**

```typescript
// ❌ Mutation (변이) - 원본 수정
const numbers = [1, 2, 3];
numbers.push(4); // 원본 배열이 변경됨 (mutation)

// ✅ Immutable (불변) - 새로운 객체 생성
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4]; // 원본 유지, 새 배열 생성
```

#### **GraphQL과 REST의 차이**

React Query는 GraphQL에서 영감을 받았습니다.

**GraphQL 용어**

```graphql
# Query - 데이터 읽기
query GetUsers {
	users {
		id
		name
	}
}

# Mutation - 데이터 변경
mutation CreateUser($input: UserInput!) {
	createUser(input: $input) {
		id
		name
	}
}
```

**REST API 매핑**

- GraphQL Query → REST GET → React Query의 **useQuery**
- GraphQL Mutation → REST POST/PUT/DELETE → React Query의 **useMutation**

### 🎯 왜 "Update", "Change"가 아닌 "Mutation"인가?

1. **GraphQL 생태계와의 일관성**
   - GraphQL을 사용하는 개발자들이 쉽게 이해할 수 있음

2. **명확한 의미 전달**
   - "Update"는 수정만 의미할 수 있음
   - "Mutation"은 생성/수정/삭제 모두 포함

3. **함수형 프로그래밍 용어**
   - 순수 함수(pure function)가 아닌 부작용(side effect)이 있는 작업

---

## 3. 낙관적 업데이트 (Optimistic Update)

### 🚀 개념

**사용자 경험을 위해 서버 응답을 기다리지 않고 UI를 먼저 업데이트하는 기법**

### 일반적인 플로우 vs 낙관적 업데이트

#### **일반적인 플로우 (느림)**

```
1. 사용자가 "좋아요" 버튼 클릭
2. 서버에 요청 전송 (로딩 스피너 표시) ⏳
3. 서버 응답 대기 (1~2초) ⏳
4. 응답 받으면 UI 업데이트 ✅
```

#### **낙관적 업데이트 (빠름)**

```
1. 사용자가 "좋아요" 버튼 클릭
2. 즉시 UI 업데이트 (좋아요 +1) ⚡
3. 백그라운드에서 서버 요청
4. 성공하면 그대로 유지 ✅
5. 실패하면 롤백 (원상복구) ↩️
```

### 💻 실제 코드 예시

```typescript
// 낙관적 업데이트 예시: 좋아요 기능
function useLikePost() {
  const queryClient = useQueryClient();

  return useApiMutation({
    url: '/api/posts/like',
    method: 'POST',
  }, {
    // 🎯 요청 전에 실행 (낙관적 업데이트)
    onMutate: async (postId) => {
      // 1. 진행 중인 리페치 취소 (충돌 방지)
      await queryClient.cancelQueries(['post', postId]);

      // 2. 이전 데이터 백업 (롤백용)
      const previousPost = queryClient.getQueryData(['post', postId]);

      // 3. 낙관적으로 UI 업데이트 (즉시!)
      queryClient.setQueryData(['post', postId], (old) => ({
        ...old,
        likes: old.likes + 1,
        isLiked: true
      }));

      // 4. 롤백을 위해 이전 데이터 반환
      return { previousPost };
    },

    // ✅ 성공 시
    onSuccess: () => {
      // 서버에서 최신 데이터 가져오기
      queryClient.invalidateQueries(['post']);
    },

    // ❌ 실패 시 (롤백)
    onError: (err, postId, context) => {
      // 이전 상태로 복구
      queryClient.setQueryData(
        ['post', postId],
        context.previousPost
      );

      alert('좋아요 실패! 다시 시도해주세요.');
    }
  });
}

// 사용
function PostCard({ post }) {
  const likeMutation = useLikePost();

  const handleLike = () => {
    // 클릭하자마자 UI 변경됨! (서버 응답 기다리지 않음)
    likeMutation.mutate(post.id);
  };

  return (
    <div>
      <button onClick={handleLike}>
        ❤️ {post.likes} {/* 즉시 업데이트! */}
      </button>
    </div>
  );
}
```

### 🎬 실제 동작 시나리오

#### **시나리오 1: 성공**

```
[0.0초] 사용자 클릭 → 좋아요 수: 100 → 101 (즉시 변경!)
[0.1초] 서버 요청 전송
[1.5초] 서버 응답 성공
[1.5초] 최신 데이터 리페치 → 좋아요 수: 101 확인 ✅
```

#### **시나리오 2: 실패**

```
[0.0초] 사용자 클릭 → 좋아요 수: 100 → 101 (즉시 변경!)
[0.1초] 서버 요청 전송
[1.5초] 서버 에러 (네트워크 문제)
[1.5초] 롤백 → 좋아요 수: 101 → 100 (원상복구) ↩️
[1.5초] 에러 메시지 표시
```

### 🎯 낙관적 업데이트를 사용해야 하는 경우

✅ **적합한 경우**

- SNS 좋아요, 팔로우
- 투두리스트 체크
- 간단한 설정 토글
- 댓글 작성
- **실패 확률이 낮고, 실패해도 치명적이지 않은 작업**

❌ **부적합한 경우**

- 결제 처리
- 계정 삭제
- 중요한 데이터 수정
- **실패 시 심각한 문제가 발생하는 작업**

---

## 4. 정리

### useApiQuery (조회)

- 데이터 읽기 전용
- 자동 실행 및 캐싱
- 여러 컴포넌트에서 공유
- 백그라운드 자동 리페칭

### useApiMutation (변경)

- 데이터 생성/수정/삭제
- 수동 실행 (사용자 액션)
- 캐시 무효화 및 업데이트
- 낙관적 업데이트 지원

### Mutation 네이밍

- GraphQL 용어에서 유래
- 서버 상태를 "변경"한다는 명확한 의미
- 생성/수정/삭제 모두 포함하는 포괄적 개념

### 낙관적 업데이트

- 사용자 경험 향상 (즉각적인 피드백)
- 서버 응답을 기다리지 않고 UI 먼저 업데이트
- 실패 시 자동 롤백
- 성공 확률이 높은 작업에 적합
