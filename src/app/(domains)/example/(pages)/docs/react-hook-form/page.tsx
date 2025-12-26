import type { IComponent } from '@/core/types/common';
import type { JSX } from 'react';
import { Separator } from '@/core/components/shadcn/ui/separator';
import PostForm from './_components/PostForm';
import { InfoAlerts, FeatureAlerts } from './_components/InfoAlerts';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';

interface IReactHookFormExProps {
	searchParams?: Promise<any>;
}

const ReactHookFormEx: IComponent<IReactHookFormExProps> = (): JSX.Element => {
	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					{/* 헤더 */}
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								React Hook Form + Zod + shadcn/ui
							</h1>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							현재 페이지는 <strong>Server Component</strong>이며, 폼 부분만 <strong>Client Component</strong>로 분리된
							하이브리드 패턴입니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>react-hook-form</strong>과 <strong>Zod</strong>를 활용하여 복잡한 폼 유효성 검사를 구현하고,
							<strong>shadcn/ui</strong> Form 컴포넌트로 UI를 구성한 예제입니다.
						</p>

						{/* 핵심 특징 Alert (Client Component) */}
						<InfoAlerts />
					</div>

					{/* 본문 */}
					<div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
						<Separator className="my-6" />

						{/* 구조 설명 */}
						<div className="flex flex-col gap-2 pt-6">
							<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl">
								프로젝트 구조
							</h2>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								다음과 같은 파일 구조로 구현되어 있습니다:
							</p>

							<RunCodeblock
								lineNumbers={false}
								showCodeBlockCopyButton={false}
								showCollapsed={false}
								rounded={false}
								codeTemplate={`
docs/
  react-hook-form/
    page.tsx                     # Server Component (페이지 레이아웃)
    _components/
      PostForm.tsx               # Client Component (폼 구현)
    _schemas/
      post.schema.ts             # Zod 스키마 (클라이언트/서버 공유)
    postsAction.ts               # Server Action (서버 측 검증 + API 호출)
`}
							/>
						</div>

						<Separator className="my-6" />

						{/* 1. Zod 스키마 */}
						<div className="flex flex-col gap-2 pt-6">
							<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl">
								1. Zod 스키마 정의
							</h2>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<code>_schemas/post.schema.ts</code> - 클라이언트/서버 양쪽에서 사용할 검증 스키마
							</p>

							<RunCodeblock
								codeTemplate={`import { z } from 'zod';

/**
 * 게시글 폼 검증 스키마
 * - 클라이언트/서버 양쪽에서 사용 가능
 */
export const PostFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: '제목은 최소 2자 이상이어야 합니다.' })
    .max(100, { message: '제목은 100자를 초과할 수 없습니다.' }),
  body: z
    .string()
    .min(10, { message: '내용은 최소 10자 이상이어야 합니다.' })
    .max(1000, { message: '내용은 1000자를 초과할 수 없습니다.' }),
  email: z
    .string()
    .email({ message: '올바른 이메일 형식이 아닙니다.' })
    .optional()
    .or(z.literal('')),
  category: z.enum(['general', 'tech', 'news'], {
    required_error: '카테고리를 선택해주세요.',
  }),
  agree: z.boolean().refine((val) => val === true, {
    message: '약관에 동의해주세요.',
  }),
});

/**
 * TypeScript 타입 자동 추출
 */
export type PostFormData = z.infer<typeof PostFormSchema>;`}
							/>
						</div>

						<Separator className="my-6" />

						{/* 2. Server Action */}
						<div className="flex flex-col gap-2 pt-6">
							<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl">
								2. Server Action (서버 측 검증)
							</h2>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<code>postsAction.ts</code> - 서버에서 Zod로 재검증 후 API 호출
							</p>

							<RunCodeblock
								codeTemplate={`'use server';

import { serverApi } from '@/core/common/api/server-api';
import { PostFormSchema } from './_schemas/post.schema';

export async function createPostAction(prevState: any, formData: FormData) {
  // FormData를 객체로 변환
  const rawData = {
    title: formData.get('title'),
    body: formData.get('body'),
    email: formData.get('email') || '',
    category: formData.get('category'),
    agree: formData.get('agree') === 'true',
  };

  // ✅ Zod 스키마로 서버 측 유효성 검사
  const validated = PostFormSchema.safeParse(rawData);

  // 검증 실패 시 에러 반환
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: '입력값을 확인해주세요.',
    };
  }

  // 검증 성공 시 API 호출
  try {
    const res = await serverApi('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(validated.data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.data) {
      return {
        success: true,
        data: res.data,
        message: '게시글이 작성되었습니다.',
      };
    }
  } catch (err) {
    return {
      success: false,
      message: '서버 오류가 발생했습니다.',
    };
  }
}`}
							/>
						</div>

						<Separator className="my-6" />

						{/* 3. Client Component Form */}
						<div className="flex flex-col gap-2 pt-6">
							<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl">
								3. Client Component (폼 구현)
							</h2>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<code>_components/PostForm.tsx</code> - react-hook-form + shadcn/ui Form
							</p>

							<RunCodeblock
								codeTemplate={`'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { PostFormSchema, type PostFormData } from '../_schemas/post.schema';
import { createPostAction } from '../postsAction';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/shadcn/ui/form';
import { Input } from '@/core/components/shadcn/ui/input';
import { Button } from '@/core/components/shadcn/ui/button';

export default function PostForm() {
  // Server Action 상태
  const [state, formAction, isPending] = useActionState(createPostAction, null);

  // react-hook-form 설정 (Zod 통합)
  const form = useForm<PostFormData>({
    resolver: zodResolver(PostFormSchema), // ✅ Zod 스키마 연결
    defaultValues: {
      title: '',
      body: '',
      email: '',
      category: undefined,
      agree: false,
    },
  });

  // 서버 측 검증 에러를 폼에 반영
  useEffect(() => {
    if (state && !state.success && state.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        form.setError(field as keyof PostFormData, {
          type: 'server',
          message: messages[0],
        });
      });
    }
  }, [state, form]);

  // 폼 제출
  const onSubmit = async (data: PostFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    
    formAction(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage /> {/* 에러 자동 표시 */}
            </FormItem>
          )}
        />
        
        {/* 다른 필드들... */}
        
        <Button type="submit" disabled={isPending}>
          {isPending ? '전송 중...' : '제출'}
        </Button>
      </form>
    </Form>
  );
}`}
							/>
						</div>

						<Separator className="my-6" />

						{/* 실제 동작 예제 */}
						<div className="flex flex-col gap-2 pt-6">
							<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl">
								4. 실제 동작 예제
							</h2>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								아래 폼을 작성하여 실제로 테스트해보세요. 실시간 유효성 검사가 적용됩니다.
							</p>

							<div className="my-6 p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800">
								<PostForm />
							</div>
						</div>

						<Separator className="my-6" />

						{/* 주요 기능 설명 */}
						<div className="flex flex-col gap-2 pt-6">
							<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl">주요 기능</h2>

							{/* 주요 기능 Alert (Client Component) */}
							<FeatureAlerts />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

ReactHookFormEx.displayName = 'ReactHookFormEx';
export default ReactHookFormEx;
