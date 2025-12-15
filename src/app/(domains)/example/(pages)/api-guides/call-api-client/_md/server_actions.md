---

**User**

Next.js에서 말하는 Server Actions에 대해서 알려줘

---

**Cursor**

Next.js의 **Server Actions**에 대해 자세히 설명드리겠습니다! 🚀

# Next.js Server Actions 완벽 가이드

## 📖 1. Server Actions란?

**Server Actions**는 Next.js 13.4에서 도입된 기능으로, **서버에서만 실행되는 비동기 함수**입니다.

```typescript
'use server'; // 👈 이 디렉티브가 핵심!

export async function createUser(formData: FormData) {
	// 이 코드는 서버에서만 실행됨
	// 클라이언트 번들에 포함되지 않음
}
```

### 🎯 핵심 개념

| 개념                        | 설명                                   |
| --------------------------- | -------------------------------------- |
| **서버 전용 실행**          | 코드가 절대 클라이언트로 전송되지 않음 |
| **RPC 스타일**              | 클라이언트에서 서버 함수를 직접 호출   |
| **타입 세이프**             | TypeScript 완벽 지원                   |
| **Progressive Enhancement** | JavaScript 없이도 동작                 |

---

## 🔧 2. Server Actions 작성 방법

### 방법 1: 파일 레벨에서 'use server'

```typescript
// app/actions/users.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

// ✅ 파일의 모든 함수가 Server Action
export async function createUser(formData: FormData) {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;

	const user = await db.user.create({
		data: { name, email },
	});

	revalidatePath('/users');
	return { success: true, user };
}

export async function deleteUser(userId: string) {
	await db.user.delete({ where: { id: userId } });
	revalidatePath('/users');
}
```

### 방법 2: 함수 내부에서 'use server'

```typescript
// app/users/page.tsx
export default function UsersPage() {
  // ✅ 인라인 Server Action
  async function handleSubmit(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    // 서버 코드...
  }

  return (
    <form action={handleSubmit}>
      <input name="name" />
      <button>제출</button>
    </form>
  );
}
```

---

## 🎨 3. 다양한 사용 패턴

### 패턴 1: Form Action (기본)

```typescript
'use client';

import { createUser } from '@/actions/users';

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="이름" />
      <input name="email" type="email" placeholder="이메일" />
      <button type="submit">생성</button>
    </form>
  );
}
```

### 패턴 2: useFormState로 상태 관리

```typescript
'use client';

import { useFormState } from 'react-dom';
import { createUser } from '@/actions/users';

const initialState = { message: '', errors: {} };

export function UserForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <input name="name" />
      {state.errors?.name && <p>{state.errors.name}</p>}

      <input name="email" />
      {state.errors?.email && <p>{state.errors.email}</p>}

      <button type="submit">생성</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

```typescript
// actions/users.ts
'use server';

export async function createUser(prevState: any, formData: FormData) {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;

	// 유효성 검사
	if (!name) {
		return {
			errors: { name: '이름은 필수입니다' },
			message: '유효성 검사 실패',
		};
	}

	try {
		await db.user.create({ data: { name, email } });
		return { message: '성공!', errors: {} };
	} catch (error) {
		return { message: '오류 발생', errors: {} };
	}
}
```

### 패턴 3: useFormStatus로 로딩 상태

```typescript
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '처리 중...' : '제출'}
    </button>
  );
}

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <SubmitButton />
    </form>
  );
}
```

### 패턴 4: 이벤트 핸들러에서 호출

```typescript
'use client';

import { deleteUser } from '@/actions/users';
import { useTransition } from 'react';

export function UserList({ users }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      await deleteUser(userId);
    });
  };

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button
            onClick={() => handleDelete(user.id)}
            disabled={isPending}
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 💡 4. 실전 예제

### 예제 1: 인증이 필요한 경우

```typescript
// actions/posts.ts
'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
	// 인증 확인
	const session = await auth();
	if (!session) {
		redirect('/login');
	}

	const title = formData.get('title') as string;
	const content = formData.get('content') as string;

	await db.post.create({
		data: {
			title,
			content,
			authorId: session.user.id,
		},
	});

	revalidatePath('/posts');
	redirect('/posts');
}
```

### 예제 2: Zod를 이용한 유효성 검사

```typescript
// actions/users.ts
'use server';

import { z } from 'zod';

const userSchema = z.object({
	name: z.string().min(2, '이름은 최소 2자'),
	email: z.string().email('올바른 이메일을 입력하세요'),
	age: z.number().min(18, '18세 이상이어야 합니다'),
});

export async function createUser(formData: FormData) {
	// FormData를 객체로 변환
	const rawData = {
		name: formData.get('name'),
		email: formData.get('email'),
		age: Number(formData.get('age')),
	};

	// 유효성 검사
	const result = userSchema.safeParse(rawData);

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
			message: '유효성 검사 실패',
		};
	}

	// DB 저장
	const user = await db.user.create({
		data: result.data,
	});

	revalidatePath('/users');
	return { success: true, user };
}
```

### 예제 3: 파일 업로드

```typescript
// actions/files.ts
'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
	const file = formData.get('file') as File;

	if (!file) {
		return { error: '파일을 선택하세요' };
	}

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	// 파일 저장
	const path = join(process.cwd(), 'public/uploads', file.name);
	await writeFile(path, buffer);

	return { success: true, filename: file.name };
}
```

```typescript
// Client Component
'use client';

export function FileUploadForm() {
  return (
    <form action={uploadFile}>
      <input type="file" name="file" />
      <button type="submit">업로드</button>
    </form>
  );
}
```

---

## ⚡ 5. 캐시 관리

Server Actions는 Next.js 캐시 시스템과 완벽하게 통합됩니다.

```typescript
'use server';

import {
	revalidatePath, // 특정 경로 캐시 무효화
	revalidateTag, // 특정 태그 캐시 무효화
	redirect, // 리다이렉트
} from 'next/cache';

export async function updateProduct(id: string, data: any) {
	await db.product.update({ where: { id }, data });

	// 1️⃣ 특정 경로만 재검증
	revalidatePath('/products');

	// 2️⃣ 동적 경로 재검증
	revalidatePath(`/products/${id}`);

	// 3️⃣ 레이아웃 포함 재검증
	revalidatePath('/products', 'layout');

	// 4️⃣ 태그로 재검증
	revalidateTag('products');

	// 5️⃣ 완료 후 리다이렉트
	redirect('/products');
}
```

### 태그를 이용한 캐시 관리

```typescript
// Server Component
async function getProducts() {
	const res = await fetch('https://api.example.com/products', {
		next: { tags: ['products'] }, // 👈 태그 지정
	});
	return res.json();
}

// Server Action
('use server');
export async function deleteProduct(id: string) {
	await db.product.delete({ where: { id } });
	revalidateTag('products'); // 👈 태그로 캐시 무효화
}
```

---

## ✅ 6. 장점

| 장점               | 설명                                             |
| ------------------ | ------------------------------------------------ |
| 🔒 **보안**        | 서버 코드가 클라이언트에 노출되지 않음           |
| 🎯 **간편성**      | API 라우트 없이 바로 서버 로직 호출              |
| 📦 **번들 크기**   | 서버 전용 라이브러리가 번들에 포함 안됨          |
| 🔄 **자동 재검증** | revalidatePath/Tag로 캐시 자동 관리              |
| ♿ **접근성**      | JavaScript 없이도 동작 (Progressive Enhancement) |
| 🏷️ **타입 세이프** | TypeScript 완벽 지원                             |

---

## ⚠️ 7. 주의사항 및 제한사항

### ❌ 할 수 없는 것

```typescript
'use server';

// ❌ 1. 직렬화 불가능한 값 반환 불가
export async function getUser() {
  return new Date();  // ❌ Date 객체 반환 불가
  return () => {};    // ❌ 함수 반환 불가
}

// ✅ 해결: 직렬화 가능한 값만 반환
export async function getUser() {
  return {
    createdAt: new Date().toISOString()  // ✅ 문자열로 변환
  };
}

// ❌ 2. Event handlers에서 직접 사용 불가
<button onClick={serverAction}>  // ❌ 안됨
```

### ⚠️ 주의할 점

```typescript
// 1️⃣ 에러 처리는 명시적으로
'use server';

export async function createUser(data: any) {
	try {
		await db.user.create({ data });
		return { success: true };
	} catch (error) {
		// 에러 정보를 직렬화 가능한 형태로
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

// 2️⃣ 민감한 정보는 항상 서버에서 검증
export async function updateUser(userId: string, data: any) {
	// ✅ 서버에서 권한 확인
	const session = await auth();
	if (session.user.id !== userId) {
		throw new Error('권한 없음');
	}

	// 업데이트 로직...
}
```

---

## 🏆 8. Best Practices

### 1️⃣ 별도 파일로 분리

```typescript
// ✅ Good: actions 폴더로 분리
app / actions / users.ts;
posts.ts;
auth.ts;
users / page.tsx;
```

### 2️⃣ 타입 정의

```typescript
// types/actions.ts
export type ActionState = {
	success: boolean;
	message?: string;
	errors?: Record<string, string[]>;
};

// actions/users.ts
('use server');
export async function createUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
	// ...
}
```

### 3️⃣ 재사용 가능한 검증 로직

```typescript
// lib/validation.ts
import { z } from 'zod';

export function validateFormData<T>(schema: z.Schema<T>, formData: FormData) {
	const data = Object.fromEntries(formData);
	return schema.safeParse(data);
}

// actions/users.ts
('use server');
export async function createUser(formData: FormData) {
	const result = validateFormData(userSchema, formData);
	if (!result.success) {
		return { errors: result.error.flatten().fieldErrors };
	}
	// ...
}
```

---

## 🆚 9. Server Actions vs API Routes

| 비교                        | Server Actions       | API Routes             |
| --------------------------- | -------------------- | ---------------------- |
| **용도**                    | Form 제출, Mutation  | RESTful API, 외부 호출 |
| **타입 세이프**             | ✅ 완벽              | ⚠️ 수동 설정 필요      |
| **캐시 무효화**             | ✅ 내장 (revalidate) | ❌ 수동                |
| **Progressive Enhancement** | ✅ 지원              | ❌                     |
| **외부 접근**               | ❌ 불가              | ✅ 가능                |
| **Webhook**                 | ❌ 부적합            | ✅ 적합                |

### 언제 무엇을 사용할까?

```typescript
// ✅ Server Actions 사용
- Form 제출
- 데이터 변경 (CRUD)
- 인증 후 처리
- 내부 서버 로직

// ✅ API Routes 사용
- RESTful API 제공
- Webhook 처리
- 외부 서비스에서 호출
- Rate limiting 필요
```

---

## 📝 10. 완전한 실전 예제

```typescript
// actions/todos.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const todoSchema = z.object({
	title: z.string().min(1, '제목을 입력하세요').max(100),
	description: z.string().optional(),
});

export async function createTodo(formData: FormData) {
	// 1. 인증 확인
	const session = await auth();
	if (!session) {
		return { error: '로그인이 필요합니다' };
	}

	// 2. 데이터 검증
	const result = todoSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
	});

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
		};
	}

	// 3. DB 저장
	try {
		const todo = await db.todo.create({
			data: {
				...result.data,
				userId: session.user.id,
			},
		});

		// 4. 캐시 무효화
		revalidatePath('/todos');

		return { success: true, todo };
	} catch (error) {
		return { error: '저장 실패' };
	}
}

export async function deleteTodo(todoId: string) {
	const session = await auth();
	if (!session) {
		return { error: '로그인이 필요합니다' };
	}

	// 권한 확인
	const todo = await db.todo.findUnique({
		where: { id: todoId },
	});

	if (todo?.userId !== session.user.id) {
		return { error: '권한이 없습니다' };
	}

	await db.todo.delete({
		where: { id: todoId },
	});

	revalidatePath('/todos');
	return { success: true };
}

export async function toggleTodo(todoId: string) {
	const todo = await db.todo.findUnique({
		where: { id: todoId },
	});

	await db.todo.update({
		where: { id: todoId },
		data: { completed: !todo?.completed },
	});

	revalidatePath('/todos');
}
```

```typescript
// components/TodoForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createTodo } from '@/actions/todos';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? '생성 중...' : '할 일 추가'}
    </button>
  );
}

export function TodoForm() {
  const [state, formAction] = useFormState(createTodo, { errors: {} });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <input
          name="title"
          placeholder="할 일 제목"
          className="border p-2 rounded"
        />
        {state.errors?.title && (
          <p className="text-red-500 text-sm">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="설명 (선택사항)"
          className="border p-2 rounded w-full"
        />
      </div>

      <SubmitButton />

      {state.error && (
        <p className="text-red-500">{state.error}</p>
      )}
    </form>
  );
}
```

```typescript
// components/TodoList.tsx
'use client';

import { useTransition } from 'react';
import { deleteTodo, toggleTodo } from '@/actions/todos';

export function TodoList({ todos }) {
  const [isPending, startTransition] = useTransition();

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <li key={todo.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              startTransition(() => {
                toggleTodo(todo.id);
              });
            }}
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.title}
          </span>
          <button
            onClick={() => {
              startTransition(() => {
                deleteTodo(todo.id);
              });
            }}
            disabled={isPending}
            className="text-red-500"
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

이제 Server Actions에 대해 완벽하게 이해하셨을 것입니다! 추가로 궁금한 점이나 특정 사용 사례에 대해 더 알고 싶으신 부분이 있나요? 😊

```typescript
'use server'; // 👈 이 디렉티브가 핵심!

export async function createUser(formData: FormData) {
	// 이 코드는 서버에서만 실행됨
	// 클라이언트 번들에 포함되지 않음
}
```

```typescript
// app/actions/users.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

// ✅ 파일의 모든 함수가 Server Action
export async function createUser(formData: FormData) {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;

	const user = await db.user.create({
		data: { name, email },
	});

	revalidatePath('/users');
	return { success: true, user };
}

export async function deleteUser(userId: string) {
	await db.user.delete({ where: { id: userId } });
	revalidatePath('/users');
}
```

```typescript
// app/users/page.tsx
export default function UsersPage() {
  // ✅ 인라인 Server Action
  async function handleSubmit(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    // 서버 코드...
  }

  return (
    <form action={handleSubmit}>
      <input name="name" />
      <button>제출</button>
    </form>
  );
}
```

```typescript
'use client';

import { createUser } from '@/actions/users';

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="이름" />
      <input name="email" type="email" placeholder="이메일" />
      <button type="submit">생성</button>
    </form>
  );
}
```

```typescript
'use client';

import { useFormState } from 'react-dom';
import { createUser } from '@/actions/users';

const initialState = { message: '', errors: {} };

export function UserForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <input name="name" />
      {state.errors?.name && <p>{state.errors.name}</p>}

      <input name="email" />
      {state.errors?.email && <p>{state.errors.email}</p>}

      <button type="submit">생성</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

```typescript
// actions/users.ts
'use server';

export async function createUser(prevState: any, formData: FormData) {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;

	// 유효성 검사
	if (!name) {
		return {
			errors: { name: '이름은 필수입니다' },
			message: '유효성 검사 실패',
		};
	}

	try {
		await db.user.create({ data: { name, email } });
		return { message: '성공!', errors: {} };
	} catch (error) {
		return { message: '오류 발생', errors: {} };
	}
}
```

```typescript
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '처리 중...' : '제출'}
    </button>
  );
}

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <SubmitButton />
    </form>
  );
}
```

```typescript
'use client';

import { deleteUser } from '@/actions/users';
import { useTransition } from 'react';

export function UserList({ users }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      await deleteUser(userId);
    });
  };

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button
            onClick={() => handleDelete(user.id)}
            disabled={isPending}
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```typescript
// actions/posts.ts
'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
	// 인증 확인
	const session = await auth();
	if (!session) {
		redirect('/login');
	}

	const title = formData.get('title') as string;
	const content = formData.get('content') as string;

	await db.post.create({
		data: {
			title,
			content,
			authorId: session.user.id,
		},
	});

	revalidatePath('/posts');
	redirect('/posts');
}
```

```typescript
// actions/users.ts
'use server';

import { z } from 'zod';

const userSchema = z.object({
	name: z.string().min(2, '이름은 최소 2자'),
	email: z.string().email('올바른 이메일을 입력하세요'),
	age: z.number().min(18, '18세 이상이어야 합니다'),
});

export async function createUser(formData: FormData) {
	// FormData를 객체로 변환
	const rawData = {
		name: formData.get('name'),
		email: formData.get('email'),
		age: Number(formData.get('age')),
	};

	// 유효성 검사
	const result = userSchema.safeParse(rawData);

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
			message: '유효성 검사 실패',
		};
	}

	// DB 저장
	const user = await db.user.create({
		data: result.data,
	});

	revalidatePath('/users');
	return { success: true, user };
}
```

```typescript
// actions/files.ts
'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
	const file = formData.get('file') as File;

	if (!file) {
		return { error: '파일을 선택하세요' };
	}

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	// 파일 저장
	const path = join(process.cwd(), 'public/uploads', file.name);
	await writeFile(path, buffer);

	return { success: true, filename: file.name };
}
```

```typescript
// Client Component
'use client';

export function FileUploadForm() {
  return (
    <form action={uploadFile}>
      <input type="file" name="file" />
      <button type="submit">업로드</button>
    </form>
  );
}
```

```typescript
'use server';

import {
	revalidatePath, // 특정 경로 캐시 무효화
	revalidateTag, // 특정 태그 캐시 무효화
	redirect, // 리다이렉트
} from 'next/cache';

export async function updateProduct(id: string, data: any) {
	await db.product.update({ where: { id }, data });

	// 1️⃣ 특정 경로만 재검증
	revalidatePath('/products');

	// 2️⃣ 동적 경로 재검증
	revalidatePath(`/products/${id}`);

	// 3️⃣ 레이아웃 포함 재검증
	revalidatePath('/products', 'layout');

	// 4️⃣ 태그로 재검증
	revalidateTag('products');

	// 5️⃣ 완료 후 리다이렉트
	redirect('/products');
}
```

```typescript
// Server Component
async function getProducts() {
	const res = await fetch('https://api.example.com/products', {
		next: { tags: ['products'] }, // 👈 태그 지정
	});
	return res.json();
}

// Server Action
('use server');
export async function deleteProduct(id: string) {
	await db.product.delete({ where: { id } });
	revalidateTag('products'); // 👈 태그로 캐시 무효화
}
```

```typescript
'use server';

// ❌ 1. 직렬화 불가능한 값 반환 불가
export async function getUser() {
  return new Date();  // ❌ Date 객체 반환 불가
  return () => {};    // ❌ 함수 반환 불가
}

// ✅ 해결: 직렬화 가능한 값만 반환
export async function getUser() {
  return {
    createdAt: new Date().toISOString()  // ✅ 문자열로 변환
  };
}

// ❌ 2. Event handlers에서 직접 사용 불가
<button onClick={serverAction}>  // ❌ 안됨
```

```typescript
// 1️⃣ 에러 처리는 명시적으로
'use server';

export async function createUser(data: any) {
	try {
		await db.user.create({ data });
		return { success: true };
	} catch (error) {
		// 에러 정보를 직렬화 가능한 형태로
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

// 2️⃣ 민감한 정보는 항상 서버에서 검증
export async function updateUser(userId: string, data: any) {
	// ✅ 서버에서 권한 확인
	const session = await auth();
	if (session.user.id !== userId) {
		throw new Error('권한 없음');
	}

	// 업데이트 로직...
}
```

```typescript
// ✅ Good: actions 폴더로 분리
app / actions / users.ts;
posts.ts;
auth.ts;
users / page.tsx;
```

```typescript
// types/actions.ts
export type ActionState = {
	success: boolean;
	message?: string;
	errors?: Record<string, string[]>;
};

// actions/users.ts
('use server');
export async function createUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
	// ...
}
```

```typescript
// lib/validation.ts
import { z } from 'zod';

export function validateFormData<T>(schema: z.Schema<T>, formData: FormData) {
	const data = Object.fromEntries(formData);
	return schema.safeParse(data);
}

// actions/users.ts
('use server');
export async function createUser(formData: FormData) {
	const result = validateFormData(userSchema, formData);
	if (!result.success) {
		return { errors: result.error.flatten().fieldErrors };
	}
	// ...
}
```

```typescript
// ✅ Server Actions 사용
- Form 제출
- 데이터 변경 (CRUD)
- 인증 후 처리
- 내부 서버 로직

// ✅ API Routes 사용
- RESTful API 제공
- Webhook 처리
- 외부 서비스에서 호출
- Rate limiting 필요
```

```typescript
// actions/todos.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const todoSchema = z.object({
	title: z.string().min(1, '제목을 입력하세요').max(100),
	description: z.string().optional(),
});

export async function createTodo(formData: FormData) {
	// 1. 인증 확인
	const session = await auth();
	if (!session) {
		return { error: '로그인이 필요합니다' };
	}

	// 2. 데이터 검증
	const result = todoSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
	});

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
		};
	}

	// 3. DB 저장
	try {
		const todo = await db.todo.create({
			data: {
				...result.data,
				userId: session.user.id,
			},
		});

		// 4. 캐시 무효화
		revalidatePath('/todos');

		return { success: true, todo };
	} catch (error) {
		return { error: '저장 실패' };
	}
}

export async function deleteTodo(todoId: string) {
	const session = await auth();
	if (!session) {
		return { error: '로그인이 필요합니다' };
	}

	// 권한 확인
	const todo = await db.todo.findUnique({
		where: { id: todoId },
	});

	if (todo?.userId !== session.user.id) {
		return { error: '권한이 없습니다' };
	}

	await db.todo.delete({
		where: { id: todoId },
	});

	revalidatePath('/todos');
	return { success: true };
}

export async function toggleTodo(todoId: string) {
	const todo = await db.todo.findUnique({
		where: { id: todoId },
	});

	await db.todo.update({
		where: { id: todoId },
		data: { completed: !todo?.completed },
	});

	revalidatePath('/todos');
}
```

```typescript
// components/TodoForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createTodo } from '@/actions/todos';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? '생성 중...' : '할 일 추가'}
    </button>
  );
}

export function TodoForm() {
  const [state, formAction] = useFormState(createTodo, { errors: {} });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <input
          name="title"
          placeholder="할 일 제목"
          className="border p-2 rounded"
        />
        {state.errors?.title && (
          <p className="text-red-500 text-sm">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="설명 (선택사항)"
          className="border p-2 rounded w-full"
        />
      </div>

      <SubmitButton />

      {state.error && (
        <p className="text-red-500">{state.error}</p>
      )}
    </form>
  );
}
```

```typescript
// components/TodoList.tsx
'use client';

import { useTransition } from 'react';
import { deleteTodo, toggleTodo } from '@/actions/todos';

export function TodoList({ todos }) {
  const [isPending, startTransition] = useTransition();

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <li key={todo.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              startTransition(() => {
                toggleTodo(todo.id);
              });
            }}
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.title}
          </span>
          <button
            onClick={() => {
              startTransition(() => {
                deleteTodo(todo.id);
              });
            }}
            disabled={isPending}
            className="text-red-500"
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}
```
