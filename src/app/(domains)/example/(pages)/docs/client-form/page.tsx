'use client';

import type { IComponent } from '@/core/types/common';
import { useState, type JSX } from 'react';

//import { Card, CardContent } from '@/core/components/shadcn/ui/card';
//import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/shadcn/ui/tabs';
import { Separator } from '@/core/components/shadcn/ui/separator';

//import UICodeBlock from '@/shared/components/common/ui/UICodeBlock';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';
import { Icon, Alert, AlertDescription, AlertTitle } from '@components/ui';

import { postsAction } from './postsAction';
import Image from 'next/image';
import clientFormDiagram from '@/assets/images/ex/clientForm01.svg';
import clientFormDiagram02 from '@/assets/images/ex/clientForm02.svg';

interface IClientFormExProps {
	searchParams?: Promise<any>;
}

const ClientFormEx: IComponent<IClientFormExProps> = (): JSX.Element => {
	// form 제출 (useState + action직접 전달 방식) START ==========================================
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	// form 제출 (useState + action직접 전달 방식) END ============================================

	// form 제출 (useState + onSubmit 방식) START ================================================
	const [loading2, setLoading2] = useState(false);
	const [result2, setResult2] = useState<any>(null);
	const [error2, setError2] = useState<string | null>(null);
	// form 제출 (useState + onSubmit 방식) END ==================================================

	// form 제출 (useState + action직접 전달 방식) START ==========================================
	// form action에 전달할 wrapper 함수
	const handleFormAction = async (formData: FormData) => {
		setLoading(true);

		try {
			const response = await postsAction(formData);
			console.log('response:::', response);
			setResult(response);
			setTimeout(() => setLoading(false), 100);
		} catch (error) {
			console.error('error:::', error);
			setTimeout(() => setLoading(false), 100);
		}
	};
	// form 제출 (useState + action직접 전달 방식) END ============================================

	// form 제출 (useState + onSubmit 방식) START ================================================
	// form의 onSubmit 이벤트 처리 핸들러
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // 기본 폼 제출 방지

		setLoading2(true);
		setError2(null);

		try {
			// FormData 직접 생성
			const formData = new FormData(e.currentTarget);

			// Server Action 직접 호출 (formData만 전달)
			const response = await postsAction(formData);
			console.log('response:::', response);
			setResult2(response);
			setLoading2(false);
		} catch (error) {
			console.error('error:::', error);
			setError2('폼 제출 중 오류가 발생했습니다.');
			setLoading2(false);
		}
	};
	// form 제출 (useState + onSubmit 방식) END ==================================================

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								FormData 전송 (Client Component + Server Action)
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							현재 화면은 <strong>Client Component</strong>로 구성되어 있습니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>Client Component</strong>에서 <strong>FormData</strong>를 <strong>Server Action</strong>으로
							전달하고, <strong>Server Action</strong>에서는 <strong>FormData</strong>를 파싱하여{' '}
							<strong>REST API</strong>를 호출하는 과정의 예제입니다.
						</p>
						<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
							<Icon
								name="MessageCircleWarning"
								className="text-blue-600 dark:text-blue-400"
							/>
							<AlertTitle className="text-blue-900 dark:text-blue-100">
								Client Component &#8594; ServerAction Form제출 다양한 방법
							</AlertTitle>
							<AlertDescription className="text-blue-800 dark:text-blue-200">
								<div className="flex flex-col gap-2">
									{/*<p className="text-sm">...</p>*/}
									<ul className="list-disc list-inside text-sm space-y-1">
										<li>
											<strong>Client Component &#8594; Server Action</strong> Form 제출에는 다음과 같이 여러 가지 방법이
											있으며, 각각 약간의 차이가 있습니다. 상황에 따라 적절한 방법을 선택하여 사용합니다.
											<div className="rounded-lg border border-blue-300 bg-blue-100/70 dark:border-blue-700 dark:bg-blue-900/50 p-2">
												<ul className="list-inside text-sm space-y-1 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
													<li>
														<strong>useActionState + useFormStatus : </strong>
														Next.js 권장방식. 로딩상태, 에러처리 가능. submit버튼 컴포넌트로 분리.
													</li>
													<li>
														<strong>useActionState만 사용 : </strong>
														submit버튼 컴포넌트로 분리하지 않은 경우 사용.
														{/*<ul className="list-disc list-inside text-sm space-y-1 pl-4 border-l-2 border-blue-500">
															<li>revalidate : 지정된 시간(초) 후 데이터를 재검증 (ISR)</li>
															<li>tags : 특정 태그로 캐시를 그룹화하여 revalidateTag()로 수동 무효화 가능</li>
														</ul>*/}
													</li>
													<li>
														<strong>useState + useTransition : </strong>
														복잡한 로직이 필요한 경우 사용. 좀 더 세밀한 제어가능. action이 아닌 onSubmit으로 폼 제출
														처리 해야함.
													</li>
													<li>
														<strong>useState + 직접처리(onSubmit) : </strong>
														useTransition을 사용하지 않고 onSubmit으로 비동기 함수 구현.
													</li>
													<li>
														<strong>useState + form action직접 전달 : </strong>
														form action에 비동기 함수를 직접 바인딩 후 Server Action으로 전달. 코드가 간결하지만 로딩
														상태 등 제어가 제한적일 수 있음. 간단한 폼일경우에 사용하는것이 좋음.
													</li>
													<li>
														<strong>react-hook-form + Server Action : </strong>
														복잡한 폼 유효성 검사 가능. react-hook-form라이브러리 설치 필요.
													</li>
												</ul>
											</div>
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
									Form예제(useState + action)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								Client Component에서 Form 제출을 처리할 때 <strong>useState + action직접 전달 방식</strong>을 사용하여
								구현한 예제입니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								코드가 간결하지만 복잡한 폼 유효성 검사, 로딩상태 등을 처리할 때는 적합하지 않습니다.
							</p>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									폼 제출 처리 흐름
								</h4>

								<div className="flex justify-center py-1">
									<Image
										src={clientFormDiagram}
										alt="Client Form Diagram"
										width={700}
										height={400}
									/>
								</div>
								{/*<RunCodeblock
								lineNumbers={false}
								showCodeBlockCopyButton={false}
								showCollapsed={false}
								rounded={false}
								codeTemplate={`
┌───────────────────────────────────────────────────────────────┐
│   1.  사용자 폼 입력 & 제출 (Client Component)                 │
│                                                               │
│    <form action={handleFormAction}>                           │
│      [ID] [제목] [내용] [제출 버튼]                            │
│    </form>                                                    │
└─────────────────────┬─────────────────────────────────────────┘
                      │ FormData 전송 (useState + action 핸들러)
                      ▼
┌───────────────────────────────────────────────────────────────┐
│    2.  handleFormAction (클라이언트)                          │
│                                                               │
│  • FormData 파싱                                              │
│  • postsAction() → REST API 호출                              │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────────┐
│    3.  Server Action (postsAction.ts)                         │
│                                                               │
│  • FormData를 받아 serverApi() 통해 REST API 호출              │
│  • 응답 객체 반환                                              │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────────┐
│    4.  REST API 응답                                          │
│                                                               │
│  { id: 101, title: "...", body: "...", ... }                  │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────────┐
│    5.  클라이언트에서 결과 렌더링                             │
│                                                               │
│  • useState로 받은 결과(result) 사용                          │
│  • JSON.stringify(result) 등으로 결과 화면 표시                │
└───────────────────────────────────────────────────────────────┘
							`}
							/>*/}
							</div>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">예제 코드</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										title="'https://jsonplaceholder.typicode.com/posts' 호출"
										codeTemplate={`// ========================================================
// SamplePage.tsx
// ========================================================
'use client';

import { useState } from 'react';
import { postsAction } from './postsAction';

function SamplePage({ searchParams }) {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);

	// form action에 전달할 wrapper 함수
	const handleFormAction = async (formData: FormData) => {
		setLoading(true);

		try {
			const response = await postsAction(formData);
			console.log('response:::', response);
			setResult(response);
			setTimeout(() => setLoading(false), 100);
		} catch (error) {
			console.error('error:::', error);
			setTimeout(() => setLoading(false), 100);
		}
	};

	return (
		<div>
			<form action={handleFormAction}>
				<input name="id" defaultValue="1" />
				<input name="title" defaultValue="제목 1" />
				<textarea name="body" defaultValue="내용 1" />
				<button type="submit">{loading ? '전송 중...' : 'POST 요청 보내기'}</button>
			</form>
			{/* 폼 제출 결과 표시 부분 */}
			<pre>
				{result && result?.success ? (
					(() => {
						try {
							return JSON.stringify(result, null, 2);
						} catch {
							return <span className="text-neutral-400">결과 없음</span>;
						}
					})()
				) : (
					<span className="text-neutral-400">결과 없음</span>
				)}
			</pre>
		</div>
	);
}
	
// ========================================================
// postsAction.ts (Server Action)
// ========================================================
'use server';

import { serverApi } from '@fetch/server-api';

export async function postsAction(formData: FormData) {
	//const id = formData.get('id') as string;
	const title = formData.get('title') as string;
	const body = formData.get('body') as string;
	const id = formData.get('id') as string;

	console.log('Received:', { title, body, id });

	try {
		// serverApi 호출 (Server Action)
		// Next.js Server Action에서는 FormData를 직접 전달할 수 있습니다.
		// serverApi 내부의 fetch가 FormData를 감지하여 자동으로 Content-Type: multipart/form-data를 설정합니다.
		const res = await serverApi<any>('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: formData,
			cache: 'no-store',
		});

		console.log('[https://jsonplaceholder.typicode.com/posts] response:', res);
		console.log('[https://jsonplaceholder.typicode.com/posts] error:', res.message);

		// 성공 처리
		if (res.data) {
			console.log('[https://jsonplaceholder.typicode.com/posts] response:', res.data);
			// 성공 응답
			return { success: true, message: '게시글이 작성되었습니다.', data: res.data };
		} else {
			return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
		}
	} catch (err) {
		console.error('API Error:', err);
		return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
	}
}
// ========================================================`}
									>
										<div className="w-full max-w-md mx-auto my-8 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800">
											<form
												className="flex flex-col gap-5"
												action={handleFormAction}
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
													className="mt-2 w-full py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
												>
													{loading ? '전송 중...' : 'POST 요청 보내기'}
												</button>
											</form>
											<div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 text-center">
												폼 제출 시 서버로 FormData(id, title, body)를 전송합니다.
											</div>
											<div className="mt-4">
												<div className="flex flex-col md:flex-row gap-4">
													<div className="flex-1 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
														<div className="font-semibold mb-1 text-sm text-sky-700 dark:text-sky-300 flex flex-col items-start gap-0.5">
															<span>폼 제출 결과</span>
															<span className="text-xs text-neutral-500">(result)</span>
														</div>
														<pre className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-md p-2 border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
															{result && result?.success ? (
																(() => {
																	try {
																		return JSON.stringify(result, null, 2);
																	} catch {
																		return <span className="text-neutral-400">결과 없음</span>;
																	}
																})()
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
									Form예제(useState + onSubmit)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								Client Component에서 Form 제출을 처리할 때 <strong>useState + onSubmit 방식</strong>을 사용하여 구현한
								예제입니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>useActionState, useFormStatus</strong>와 같이 React, Next.js에서 제공하는 훅을 사용하지 않으면
								로딩상태 및 폼 유효성 검사 등을 직접 구현해야 합니다.
							</p>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									폼 제출 처리 흐름
								</h4>

								<div className="flex justify-center py-1">
									<Image
										src={clientFormDiagram02}
										alt="Client Form Diagram (onSubmit)"
										width={700}
										height={1120} // 기존 900 → 1120으로 늘려 잘림 방지
									/>
								</div>
							</div>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">예제 코드</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										title="'https://jsonplaceholder.typicode.com/posts' 호출"
										codeTemplate={`// ========================================================
// SamplePage.tsx
// useState + onSubmit 방식
// ========================================================
'use client';
import { useState } from 'react';
import { postsAction } from './postsAction';

function SamplePage({ searchParams }) {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	// form의 onSubmit 이벤트 처리 핸들러
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // 기본 폼 제출 방지

		setLoading(true);
		setError(null);

		try {
			// FormData 직접 생성
			const formData = new FormData(e.currentTarget);

			// Server Action 직접 호출 (formData만 전달)
			const response = await postsAction(formData);
			console.log('response:::', response);
			setResult(response);
			setLoading(false)
		} catch (error) {
			console.error('error:::', error);
			setError('폼 제출 중 오류가 발생했습니다.');
			setLoading(false)
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input name="id" defaultValue="1" />
				<input name="title" defaultValue="제목 1" />
				<textarea name="body" defaultValue="내용 1" />
				<button type="submit" disabled={loading}>{loading ? '전송 중...' : 'POST 요청 보내기'}</button>
			</form>
			{/* 폼 제출 결과 표시 부분 */}
			<pre>
				{result && result?.success ? (
					(() => {
						try {
							return JSON.stringify(result, null, 2);
						} catch {
							return <span className="text-neutral-400">결과 없음\{error === null ? '' : \`\(\$\{error\}\)\`\}</span>;
						}
					})()
				) : (
					<span className="text-neutral-400">결과 없음\{error === null ? '' : \`\(\$\{error\}\)\`\}</span>
				)}
			</pre>
		</div>
	);
}
	
// ========================================================
// postsAction.ts (Server Action)
// ========================================================
'use server';

import { serverApi } from '@fetch/server-api';

export async function postsAction(formData: FormData) {
	//const id = formData.get('id') as string;
	const title = formData.get('title') as string;
	const body = formData.get('body') as string;
	const id = formData.get('id') as string;

	console.log('Received:', { title, body, id });

	try {
		// serverApi 호출 (Server Action)
		// Next.js Server Action에서는 FormData를 직접 전달할 수 있습니다.
		// serverApi 내부의 fetch가 FormData를 감지하여 자동으로 Content-Type: multipart/form-data를 설정합니다.
		const res = await serverApi<any>('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: formData,
			cache: 'no-store',
		});

		console.log('[https://jsonplaceholder.typicode.com/posts] response:', res);
		console.log('[https://jsonplaceholder.typicode.com/posts] error:', res.message);

		// 성공 처리
		if (res.data) {
			console.log('[https://jsonplaceholder.typicode.com/posts] response:', res.data);
			// 성공 응답
			return { success: true, message: '게시글이 작성되었습니다.', data: res.data };
		} else {
			return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
		}
	} catch (err) {
		console.error('API Error:', err);
		return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
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
													disabled={loading2}
													className="mt-2 w-full py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
												>
													{loading2 ? '전송 중...' : 'POST 요청 보내기'}
												</button>
											</form>
											<div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 text-center">
												폼 제출 시 서버로 FormData(id, title, body)를 전송합니다.
											</div>
											<div className="mt-4">
												<div className="flex flex-col md:flex-row gap-4">
													<div className="flex-1 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
														<div className="font-semibold mb-1 text-sm text-sky-700 dark:text-sky-300 flex flex-col items-start gap-0.5">
															<span>폼 제출 결과</span>
															<span className="text-xs text-neutral-500">(result)</span>
														</div>
														<pre className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-md p-2 border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
															{result2 && result2?.success ? (
																(() => {
																	try {
																		return JSON.stringify(result2, null, 2);
																	} catch {
																		return (
																			<span className="text-neutral-400">
																				결과 없음{error2 === null ? '' : `(${error2})`}
																			</span>
																		);
																	}
																})()
															) : (
																<span className="text-neutral-400">
																	결과 없음{error2 === null ? '' : `(${error2})`}
																</span>
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
									커스텀 훅으로 재사용
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								비슷한 Form 제출 처리 로직이 여러 컴포넌트에서 반복된다면, <strong>커스텀 훅</strong>으로 만들어
								재사용할 수 있습니다. 아래는 이를 구현한 커스텀 훅 예제 코드입니다.
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
										codeTemplate={`
// useServerAction.ts - 커스텀 훅
'use client';
 
import { useState } from 'react';
 
export function useServerAction<T = any>(action: (formData: FormData) => Promise<any>) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
 
	const execute = async (formData: FormData) => {
		setLoading(true);
		setError(null);

		try {
			// Server Action 직접 호출 (formData만 전달)
			// 넘겨받은 action함수를 사용합니다.
			const result = await action(formData);
			
			if (result.success) {
				setData(result.data);
				return result;
			} else {
				setError(result.message);
				return result;
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '오류 발생';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setData(null);
		setError(null);
		setLoading(false);
	};

	return {
		loading,
		data,
		error,
		execute,
		reset,
	};
}

// 사용 =============================================
'use client';

import { useServerAction } from '@/hooks/useServerAction';
import { postsAction } from './postsAction';

export default function ClientFormPage() {
  const { loading, data, error, execute } = useServerAction(postsAction);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await execute(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" disabled={loading} />
      <textarea name="body" disabled={loading} />
      <button type="submit" disabled={loading}>
        {loading ? '전송 중...' : '제출'}
      </button>
      
      {data && <div>성공: {JSON.stringify(data)}</div>}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
							`}
									/>
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
									Form예제(useActionState)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>useActionState</strong>(Server Action의 결과를 상태로 관리하는 핵심 훅)를 사용하여 Form 제출
								처리를 구현한 예제입니다.
							</p>
							<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
								<Icon
									name="MessageCircleWarning"
									className="text-blue-600 dark:text-blue-400"
								/>
								<AlertTitle className="text-blue-900 dark:text-blue-100">useActionState의 장점</AlertTitle>
								<AlertDescription className="text-blue-800 dark:text-blue-200">
									<div className="flex flex-col gap-2">
										{/*<p className="text-sm">...</p>*/}
										<ul className="list-disc list-inside text-sm space-y-1">
											<li>
												<strong>자동 상태 관리 : </strong>Server Action 결과가 자동으로 state에 저장
											</li>
											<li>
												<strong>isPending 제공 : </strong>로딩 상태를 별도로 관리할 필요 없음
											</li>
											<li>
												<strong>에러 처리 간편 : </strong>반환값으로 에러 전달
											</li>
										</ul>
									</div>
								</AlertDescription>
							</Alert>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									useActionState 예제 코드
								</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										lineNumbers={false}
										showCodeBlockCopyButton={false}
										showCollapsed={false}
										rounded={false}
										codeTemplate={`
'use client';

import { useActionState } from 'react';
import { postsAction } from './postsAction';
 
export default function ClientFormPage() {
  // ✅ useActionState로 Server Action 결과 자동 관리
  const [state, formAction, isPending] = useActionState(
    postsAction,
    null // 초기 상태 값
  );

  return (
    <div>
      <form action={formAction}>
        <input name="id" defaultValue="1" />
        <input name="title" placeholder="제목" />
        <textarea name="body" placeholder="내용" />
        
        {/* isPending으로 로딩 상태 표시 */}
        <button type="submit" disabled={isPending}>
          {isPending ? '전송 중...' : 'POST 요청 보내기'}
        </button>
      </form>

      {/* ✅ state로 결과 자동 표시 */}
      {state?.success && (
        <div className="success">
          <h3>{state.message}</h3>
          <pre>{JSON.stringify(state.data, null, 2)}</pre>
        </div>
      )}

      {state?.success === false && (
        <div className="error">{state.message}</div>
      )}
    </div>
  );
}
 
 
// ========================================================
// postsAction.ts (Server Action)
// ========================================================
'use server';

import { serverApi } from '@fetch/server-api';

// ✅ 첫 번째 매개변수는 이전 상태 (필수!)
export async function postsAction(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const id = formData.get('id') as string;

  try {
    const res = await serverApi<any>(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      }
    );

    if (res.data) {
      // ✅ 반환된 객체가 자동으로 state가 됨
      return {
        success: true,
        data: res.data,
        message: '게시글이 작성되었습니다.',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('API Error:', err);
    return {
      success: false,
      message: '폼 제출 중 오류가 발생했습니다.',
      error: err.message,
    };
  }
  
  return {
    success: false,
    message: '폼이 제출되지 않았습니다.',
    data: null,
  };
}
							`}
									/>
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
									Form예제(useActionState + useFormStatus)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>useFormStatus</strong>(폼의 제출 상태를 추적하는 훅 (자식 컴포넌트에서 사용))를 useActionState과
								함께 사용하여 Form 제출 처리를 구현한 예제입니다.
							</p>
							<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
								<Icon
									name="MessageCircleWarning"
									className="text-blue-600 dark:text-blue-400"
								/>
								<AlertTitle className="text-blue-900 dark:text-blue-100">useFormStatus의 특징</AlertTitle>
								<AlertDescription className="text-blue-800 dark:text-blue-200">
									<div className="flex flex-col gap-2">
										{/*<p className="text-sm">...</p>*/}
										<ul className="list-disc list-inside text-sm space-y-1">
											<li>⚠️ 반드시 &lt;form&gt; 내부의 자식 컴포넌트에서만 사용 가능</li>
											<li>
												<strong>pending : </strong>폼 제출 중인지 여부
											</li>
											<li>
												<strong>data : </strong>FormData 객체
											</li>
											<li>
												<strong>method : </strong>HTTP 메서드 (post, get 등)
											</li>
											<li>
												<strong>action : </strong>실행 중인 action 함수
											</li>
										</ul>
									</div>
								</AlertDescription>
							</Alert>
							<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
								<Icon
									name="MessageCircleWarning"
									className="text-blue-600 dark:text-blue-400"
								/>
								<AlertTitle className="text-blue-900 dark:text-blue-100">
									useFormState와 useFormStatus의 차이점 (useFormState도 확인 필요)
								</AlertTitle>
								<AlertDescription className="text-blue-800 dark:text-blue-200">
									<div className="flex flex-col gap-2">
										{/*<p className="text-sm">...</p>*/}
										<ul className="list-disc list-inside text-sm space-y-1">
											<li>
												<strong>useFormState : </strong>"Server Action의 결과를 받아서 처리" (에러, 성공 메시지)
											</li>
											<li>
												<strong>useFormStatus : </strong>"지금 Form이 제출 중인지 확인" (로딩 상태)
											</li>
										</ul>
									</div>
								</AlertDescription>
							</Alert>
							<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
								<Icon
									name="MessageCircleWarning"
									className="text-blue-600 dark:text-blue-400"
								/>
								<AlertTitle className="text-blue-900 dark:text-blue-100">핵심 차이점 비교</AlertTitle>
								<AlertDescription className="text-blue-800 dark:text-blue-200">
									<div className="flex flex-col gap-2">
										<table className="w-full">
											<thead>
												<tr>
													<th className="border border-gray-300 px-4 py-2">구분</th>
													<th className="border border-gray-300 px-4 py-2">useFormState</th>
													<th className="border border-gray-300 px-4 py-2">useFormStatus</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className="border border-gray-300 px-4 py-2">사용 위치</td>
													<td className="border border-gray-300 px-4 py-2">Form 컴포넌트 자체</td>
													<td className="border border-gray-300 px-4 py-2">Form의 자식 컴포넌트만</td>
												</tr>
											</tbody>
											<tbody>
												<tr>
													<td className="border border-gray-300 px-4 py-2">주요 목적</td>
													<td className="border border-gray-300 px-4 py-2">Server Action 결과 관리</td>
													<td className="border border-gray-300 px-4 py-2">제출 중 상태 확인</td>
												</tr>
											</tbody>
											<tbody>
												<tr>
													<td className="border border-gray-300 px-4 py-2">반환값</td>
													<td className="border border-gray-300 px-4 py-2">[state, formAction]</td>
													<td className="border border-gray-300 px-4 py-2">
														&#123; pending, data, method, action &#125;
													</td>
												</tr>
											</tbody>
											<tbody>
												<tr>
													<td className="border border-gray-300 px-4 py-2">데이터</td>
													<td className="border border-gray-300 px-4 py-2">Server Action의 return 값</td>
													<td className="border border-gray-300 px-4 py-2">제출 중인 FormData</td>
												</tr>
											</tbody>
											<tbody>
												<tr>
													<td className="border border-gray-300 px-4 py-2">사용 시점</td>
													<td className="border border-gray-300 px-4 py-2">에러</td>
													<td className="border border-gray-300 px-4 py-2">에러</td>
												</tr>
											</tbody>
										</table>
									</div>
								</AlertDescription>
							</Alert>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									useActionState + useFormStatus 예제 코드
								</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										lineNumbers={false}
										showCodeBlockCopyButton={false}
										showCollapsed={false}
										rounded={false}
										codeTemplate={`
'use client';

import { useFormStatus } from 'react-dom';

// ✅ 별도의 Submit 버튼 컴포넌트
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner" />
          전송 중...
        </>
      ) : (
        'POST 요청 보내기'
      )}
    </button>
  );
}

// 메인 컴포넌트
export default function ClientFormPage() {
  const [state, formAction] = useActionState(postsAction, null);

  return (
    <form action={formAction}>
      <input name="title" placeholder="제목" />
      <textarea name="body" placeholder="내용" />
      
      {/* ✅ 자식 컴포넌트에서 useFormStatus 사용 */}
      <SubmitButton />
    </form>
  );
}
 
 
// ========================================================
// postsAction.ts (Server Action)
// ========================================================
'use server';

import { serverApi } from '@fetch/server-api';

// ✅ 첫 번째 매개변수는 이전 상태 (필수!)
export async function postsAction(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const id = formData.get('id') as string;

  try {
    const res = await serverApi<any>(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      }
    );

    if (res.data) {
      // ✅ 반환된 객체가 자동으로 state가 됨
      return {
        success: true,
        data: res.data,
        message: '게시글이 작성되었습니다.',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('API Error:', err);
    return {
      success: false,
      message: '폼 제출 중 오류가 발생했습니다.',
      error: err.message,
    };
  }
  
  return {
    success: false,
    message: '폼이 제출되지 않았습니다.',
    data: null,
  };
}
							`}
									/>
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
									Form예제(useOptimistic)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>useOptimistic</strong>(낙관적 업데이트 (Optimistic Update)를 위한 훅)을 사용하여 Form 제출
								처리를 구현한 예제입니다.
							</p>
							<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
								<Icon
									name="MessageCircleWarning"
									className="text-blue-600 dark:text-blue-400"
								/>
								<AlertTitle className="text-blue-900 dark:text-blue-100">useOptimistic의 장점</AlertTitle>
								<AlertDescription className="text-blue-800 dark:text-blue-200">
									<div className="flex flex-col gap-2">
										{/*<p className="text-sm">...</p>*/}
										<ul className="list-disc list-inside text-sm space-y-1">
											<li>
												<strong>즉각적인 UI 피드백 : </strong>서버 응답을 기다리지 않음
											</li>
											<li>
												<strong>자동 롤백 : </strong>실패 시 이전 상태로 복원
											</li>
											<li>
												<strong>더 나은 UX : </strong>앱이 더 빠르게 느껴짐
											</li>
										</ul>
									</div>
								</AlertDescription>
							</Alert>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									useOptimistic 예제 코드
								</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										lineNumbers={false}
										showCodeBlockCopyButton={false}
										showCollapsed={false}
										rounded={false}
										codeTemplate={`
'use client';

import { useOptimistic } from 'react';
import { useActionState } from 'react';
import { addPostAction } from './postsAction';

export default function PostList({ initialPosts }) {
  const [state, formAction] = useActionState(addPostAction, null);
  
  // ✅ 낙관적 업데이트 훅
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    initialPosts,
    (currentPosts, newPost) => [...currentPosts, newPost]
  );

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;

    // ✅ 즉시 UI 업데이트 (서버 응답 전)
    addOptimisticPost({
      id: 'temp-' + Date.now(),
      title,
      body,
      isPending: true, // 임시 표시
    });

    // 실제 Server Action 실행
    await formAction(formData);
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input name="title" placeholder="제목" />
        <textarea name="body" placeholder="내용" />
        <button type="submit">추가</button>
      </form>

      {/* ✅ 낙관적으로 업데이트된 목록 표시 */}
      <ul>
        {optimisticPosts.map((post) => (
          <li key={post.id} className={post.isPending ? 'opacity-50' : ''}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            {post.isPending && <span>전송 중...</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
							`}
									/>
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
									Form예제(useTransition)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>useTransition</strong>(비동기 작업의 pending 상태를 추적)을 사용하여 Form 제출 처리를 구현한
								예제입니다.
							</p>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									useTransition 예제 코드
								</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										lineNumbers={false}
										showCodeBlockCopyButton={false}
										showCollapsed={false}
										rounded={false}
										codeTemplate={`
'use client';

import { useState, useTransition } from 'react';
import { postsAction } from './postsAction';

export default function ClientFormPage() {
	const [isPending, startTransition] = useTransition();
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		const formData = new FormData(e.currentTarget);
		
		try {
			// 비동기 작업 먼저 실행
			const response = await postsAction(formData);
			
			// ✅ 상태 업데이트만 startTransition으로 감싸기
			startTransition(() => {
				if (response.success) {
					setResult(response.data);
				} else {
					setError(response.message);
				}
			});
		} catch (err) {
			startTransition(() => {
				setError('오류 발생');
			});
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input name="title" disabled={isPending} />
				<textarea name="body" disabled={isPending} />
				
				{/* ✅ isPending으로 로딩 상태 표시 */}
				<button type="submit" disabled={isPending}>
					{isPending ? '전송 중...' : '제출'}
				</button>
			</form>

			{result && <div>성공: {JSON.stringify(result)}</div>}
			{error && <div className="error">{error}</div>}
		</div>
	);
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

ClientFormEx.displayName = 'ClientFormEx';
export default ClientFormEx;
