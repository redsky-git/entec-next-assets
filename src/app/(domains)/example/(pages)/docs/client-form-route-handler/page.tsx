'use client';

import type { IComponent } from '@/core/types/common';
import { type JSX } from 'react';

import { Separator } from '@/core/components/shadcn/ui/separator';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';
import { Icon, Alert, AlertDescription, AlertTitle } from '@components/ui';
import { useApiMutation } from '@hooks/api';

interface IClientFormRouteHandlerExProps {
	searchParams?: Promise<any>;
}

interface FormSubmitResponse {
	success: boolean;
	message: string;
	data: any;
}

const ClientFormRouteHandlerEx: IComponent<IClientFormRouteHandlerExProps> = (): JSX.Element => {
	const mutation = useApiMutation('@routes/example/api/form-submit', { method: 'POST' });

	// Form 제출 핸들러
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		mutation.mutate(formData);
	};

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								FormData 전송 (Client Component + Router Handler)
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							현재 화면은 <strong>Client Component</strong>로 구성되어 있습니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>Client Component</strong>에서 <strong>FormData</strong>를 <strong>Router Handler</strong>로
							전달하고, <strong>Router Handler</strong>에서는 <strong>FormData</strong>를 파싱하여{' '}
							<strong>REST API</strong>를 호출하는 과정의 예제입니다.
						</p>
						<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
							<Icon
								name="MessageCircleWarning"
								className="text-blue-600 dark:text-blue-400"
							/>
							<AlertTitle className="text-blue-900 dark:text-blue-100">Router Handler vs Server Action</AlertTitle>
							<AlertDescription className="text-blue-800 dark:text-blue-200">
								<div className="flex flex-col gap-2">
									<ul className="list-disc list-inside text-sm space-y-1">
										<li>
											<strong>Router Handler : </strong>API 엔드포인트를 생성하는 방식. RESTful API 패턴으로 외부에서도
											호출 가능
										</li>
										<li>
											<strong>Server Action : </strong>서버 함수를 직접 호출하는 방식. 내부에서만 사용 가능
										</li>
										<li>
											<strong>사용 시기 : </strong>외부 API로 제공해야 하거나, RESTful 패턴이 필요한 경우 Router Handler
											사용
										</li>
									</ul>
								</div>
							</AlertDescription>
						</Alert>
					</div>
					<div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
						<Separator className="my-6" />
						{/* example 블럭요소 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									Form예제(Router Handler 호출)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								Client Component에서 Form 제출을 처리할 때 <strong>Router Handler</strong>를 사용하여 구현한 예제입니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>TanStack Query의 useMutation</strong>을 사용하여 Router Handler를 호출하고, 로딩 상태와 에러를
								자동으로 관리합니다.
							</p>
							<Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
								<Icon
									name="CheckCircle"
									className="text-green-600 dark:text-green-400"
								/>
								<AlertTitle className="text-green-900 dark:text-green-100">
									TanStack Query useMutation 사용의 장점
								</AlertTitle>
								<AlertDescription className="text-green-800 dark:text-green-200">
									<div className="flex flex-col gap-2">
										<ul className="list-disc list-inside text-sm space-y-1">
											<li>
												<strong>자동 상태 관리 : </strong>isPending, isSuccess, isError 등의 상태를 자동으로 관리
											</li>
											<li>
												<strong>에러 처리 : </strong>onError 콜백으로 에러 처리를 일관되게 관리
											</li>
											<li>
												<strong>성공 처리 : </strong>onSuccess 콜백으로 성공 후 추가 로직 실행 가능
											</li>
											<li>
												<strong>재시도 & 캐싱 : </strong>자동 재시도, 낙관적 업데이트 등 고급 기능 사용 가능
											</li>
										</ul>
									</div>
								</AlertDescription>
							</Alert>
							<Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
								<Icon
									name="TriangleAlert"
									className="text-amber-600 dark:text-amber-400"
								/>
								<AlertTitle className="text-amber-900 dark:text-amber-100">⚠️ FormData 객체 직렬화 문제</AlertTitle>
								<AlertDescription className="text-amber-800 dark:text-amber-200">
									<div className="flex flex-col gap-2">
										<p className="text-sm">FormData 객체를 직접 useMutation에 전달하면 다음 에러가 발생합니다:</p>
										<code className="text-xs bg-amber-100 dark:bg-amber-900 p-2 rounded">
											Failed to execute 'postMessage' on 'Window': FormData object could not be cloned.
										</code>
										<p className="text-sm">
											<strong>원인:</strong> TanStack Query DevTools가 FormData를 직렬화하려고 시도하지만, FormData는
											구조화된 복제를 지원하지 않습니다.
										</p>
										<p className="text-sm">
											<strong>해결:</strong> FormData를 일반 객체로 변환하여 전달하고, mutationFn 내부에서 다시
											FormData로 변환합니다.
										</p>
									</div>
								</AlertDescription>
							</Alert>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									폼 제출 처리 흐름
								</h4>
								<div className="my-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border">
									<pre className="text-sm overflow-x-auto">
										{`┌───────────────────────────────────────────────────────────────┐
│   1. 사용자 폼 입력 & 제출 (Client Component)                 │
│                                                               │
│    <form onSubmit={handleSubmit}>                             │
│      [ID] [제목] [내용] [제출 버튼]                            │
│    </form>                                                    │
└─────────────────────┬─────────────────────────────────────────┘
                      │ FormData 전송 (fetch API)
                      ▼
┌───────────────────────────────────────────────────────────────┐
│    2. Router Handler (/example/api/form-submit)               │
│                                                               │
│  • FormData 파싱                                              │
│  • serverApi() 통해 REST API 호출                             │
│  • 응답 객체 반환 (JSON)                                       │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────────┐
│    3. 외부 REST API 응답                                      │
│                                                               │
│  { id: 101, title: "...", body: "...", ... }                  │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────────┐
│    4. 클라이언트에서 결과 렌더링                             │
│                                                               │
│  • useState로 받은 결과(result) 사용                          │
│  • JSON.stringify(result) 등으로 결과 화면 표시                │
└───────────────────────────────────────────────────────────────┘`}
									</pre>
								</div>
							</div>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">예제 코드</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										title="Router Handler를 통한 Form 제출 (TanStack Query useMutation 사용)"
										codeTemplate={`// ========================================================
// page.tsx (Client Component)
// TanStack Query의 useMutation을 사용한 Form 제출
// ========================================================
'use client';

import { useMutation } from '@tanstack/react-query';

interface FormSubmitResponse {
	success: boolean;
	message: string;
	data: any;
}

function SamplePage() {
	// useMutation으로 Router Handler 호출
	// ⚠️ FormData를 직접 전달하면 postMessage 에러 발생!
	// 해결: 일반 객체로 변환하여 사용
	const mutation = useMutation<FormSubmitResponse, Error, Record<string, string>>({
		mutationFn: async (formValues) => {
			// 일반 객체를 FormData로 변환
			const formData = new FormData();
			Object.entries(formValues).forEach(([key, value]) => {
				formData.append(key, value);
			});

			const response = await fetch('/example/api/form-submit', {
				method: 'POST',
				body: formData, // FormData를 전달
			});

			if (!response.ok) {
				throw new Error(\`API Error: \${response.status}\`);
			}

			return response.json();
		},
		onSuccess: (data) => {
			console.log('성공:', data);
		},
		onError: (error) => {
			console.error('에러:', error);
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		
		// FormData를 일반 객체로 변환
		const formValues: Record<string, string> = {};
		formData.forEach((value, key) => {
			formValues[key] = value.toString();
		});
		
		mutation.mutate(formValues);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input name="id" defaultValue="1" />
				<input name="title" defaultValue="제목 1" />
				<textarea name="body" defaultValue="내용 1" />
				<button type="submit" disabled={mutation.isPending}>
					{mutation.isPending ? '전송 중...' : 'POST 요청 보내기'}
				</button>
			</form>
			<pre>
				{mutation.isSuccess && mutation.data 
					? JSON.stringify(mutation.data, null, 2) 
					: mutation.isError 
						? \`에러: \${mutation.error.message}\`
						: '결과 없음'}
			</pre>
		</div>
	);
}

// ========================================================
// route.ts (Router Handler)
// src/app/(domains)/example/api/form-submit/route.ts
// ========================================================
import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/core/common/api/server-api';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const body = formData.get('body') as string;

		// 외부 API 호출
		const response = await serverApi<any>(
			'https://jsonplaceholder.typicode.com/posts',
			{ method: 'POST', body: formData },
			{ revalidate: 0 }
		);

		if (response.data) {
			return NextResponse.json({
				success: true,
				message: '게시글이 작성되었습니다.',
				data: response.data,
			}, { status: 200 });
		} else {
			return NextResponse.json({
				success: false,
				message: '폼이 제출되지 않았습니다.',
			}, { status: 400 });
		}
	} catch (error) {
		return NextResponse.json({
			success: false,
			message: '폼 제출 중 오류가 발생했습니다.',
			error: error instanceof Error ? error.message : 'Unknown error',
		}, { status: 500 });
	}
}
// ========================================================`}
									>
										<div className="w-full max-w-md mx-auto my-8 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800">
											<form
												className="flex flex-col gap-5"
												onSubmit={handleSubmit}
											>
												<div>
													<label
														htmlFor="id"
														className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-200"
													>
														ID <span className="text-red-600">*</span>
													</label>
													<input
														id="id"
														name="id"
														type="text"
														placeholder="1"
														className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
														required
														defaultValue="1"
														readOnly
													/>
												</div>
												<div>
													<label
														htmlFor="title"
														className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-200"
													>
														제목 <span className="text-red-600">*</span>
													</label>
													<input
														id="title"
														name="title"
														type="text"
														defaultValue="제목 1"
														placeholder="제목을 입력하세요"
														className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
														required
													/>
												</div>
												<div>
													<label
														htmlFor="body"
														className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-200"
													>
														내용 <span className="text-red-600">*</span>
													</label>
													<textarea
														id="body"
														name="body"
														defaultValue={'내용 1'}
														placeholder="내용을 입력하세요"
														rows={4}
														className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
														required
													/>
												</div>
												<button
													type="submit"
													disabled={mutation.isPending}
													className="mt-2 w-full py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{mutation.isPending ? '전송 중...' : 'POST 요청 보내기'}
												</button>
											</form>
											<div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 text-center">
												폼 제출 시 Router Handler로 FormData(id, title, body)를 전송합니다.
											</div>
											<div className="mt-4">
												<div className="flex flex-col md:flex-row gap-4">
													<div className="flex-1 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
														<div className="font-semibold mb-1 text-sm text-sky-700 dark:text-sky-300 flex flex-col items-start gap-0.5">
															<span>폼 제출 결과</span>
															<span className="text-xs text-neutral-500">(result)</span>
														</div>
														<pre className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-md p-2 border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
															{mutation.isSuccess && mutation.data ? (
																(() => {
																	try {
																		return JSON.stringify(mutation.data, null, 2);
																	} catch {
																		return <span className="text-neutral-400">결과 없음</span>;
																	}
																})()
															) : mutation.isError ? (
																<span className="text-red-400">에러: {mutation.error.message}</span>
															) : (
																<span className="text-neutral-400">결과 없음</span>
															)}
														</pre>
													</div>
												</div>
											</div>
										</div>
									</RunCodeblock>
								</div>
							</div>
						</div>
						{/* example 블럭요소 END */}
						<Separator className="my-6" />
						{/* example 블럭요소 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									커스텀 훅으로 재사용하기
								</h2>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								FormData 전송 로직을 <strong>커스텀 훅(useFormDataMutation)</strong>으로 만들어 재사용할 수 있습니다.
							</p>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									커스텀 훅 예제 코드
								</h4>
								<div className="flex justify-center py-1">
									<RunCodeblock
										lineNumbers={false}
										showCodeBlockCopyButton={false}
										showCollapsed={false}
										rounded={false}
										codeTemplate={`// ========================================================
// useFormDataMutation.ts - 커스텀 훅
// src/core/hooks/api/useFormDataMutation.ts
// ========================================================
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export function useFormDataMutation<TData = unknown>(
	endpoint: string,
	options?: Omit<UseMutationOptions<TData, Error, Record<string, any>>, 'mutationFn'>,
) {
	return useMutation<TData, Error, Record<string, any>>({
		mutationFn: async (formValues) => {
			// 일반 객체를 FormData로 변환
			const formData = new FormData();
			Object.entries(formValues).forEach(([key, value]) => {
				if (value instanceof File || value instanceof Blob) {
					formData.append(key, value);
				} else if (Array.isArray(value)) {
					value.forEach((item) => formData.append(key, item));
				} else {
					formData.append(key, String(value));
				}
			});

			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.message || \`API Error: \${response.status}\`,
				);
			}

			if (response.status === 204) {
				return null as TData;
			}

			return response.json() as Promise<TData>;
		},
		...options,
	});
}

// ========================================================
// 사용 예제 - page.tsx
// ========================================================
'use client';

import { useFormDataMutation } from '@hooks/api';

interface FormSubmitResponse {
	success: boolean;
	message: string;
	data: any;
}

export default function ClientFormPage() {
	// 커스텀 훅 사용 - 엔드포인트만 전달
	const mutation = useFormDataMutation<FormSubmitResponse>(
		'/example/api/form-submit',
		{
			onSuccess: (data) => {
				console.log('성공:', data);
				// 성공 후 추가 로직 (예: 페이지 이동, 알림 표시 등)
			},
			onError: (error) => {
				console.error('에러:', error);
				// 에러 처리 로직
			},
		}
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		
		// FormData를 일반 객체로 변환
		const formValues = Object.fromEntries(formData.entries());
		mutation.mutate(formValues);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="title" placeholder="제목" />
			<textarea name="body" placeholder="내용" />
			<button type="submit" disabled={mutation.isPending}>
				{mutation.isPending ? '전송 중...' : '제출'}
			</button>
			
			{mutation.isSuccess && (
				<div className="success">
					{JSON.stringify(mutation.data, null, 2)}
				</div>
			)}
			
			{mutation.isError && (
				<div className="error">{mutation.error.message}</div>
			)}
		</form>
	);
}

// ========================================================
// 고급 사용 예제 - 재시도, 낙관적 업데이트
// ========================================================
export function AdvancedExample() {
	const mutation = useFormDataMutation<FormSubmitResponse>(
		'/example/api/form-submit',
		{
			retry: 3, // 실패 시 3번 재시도
			retryDelay: 1000, // 재시도 대기 시간 (1초)
			onSuccess: (data) => {
				// 캐시 무효화, 페이지 리프레시 등
				console.log('성공:', data);
			},
		}
	);

	return <form>...</form>;
}
							`}
									/>
								</div>
							</div>
						</div>
						{/* example 블럭요소 END */}
					</div>
				</div>
			</div>
		</>
	);
};

ClientFormRouteHandlerEx.displayName = 'ClientFormRouteHandlerEx';
export default ClientFormRouteHandlerEx;
