'use client';

import type { IComponent } from '@/core/types/common';
import { type JSX } from 'react';

import { Separator } from '@/core/components/shadcn/ui/separator';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';

import { postsAction } from './postsAction';
import Image from 'next/image';
import clientFormDiagram from '@/assets/images/ex/clientFormUseFormAction01.svg';
import { useFormAction } from '@hooks/api';

interface IClientFormHookExProps {
	searchParams?: Promise<any>;
}

const ClientFormHookEx: IComponent<IClientFormHookExProps> = (): JSX.Element => {
	const { loading, data, error, submitAction } = useFormAction(postsAction);

	// form 제출 (useFormAction hook 사용) START ================================================
	// form의 onSubmit 이벤트 처리 핸들러
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // 기본 폼 제출 방지

		// FormData 직접 생성
		const formData = new FormData(e.currentTarget);
		// submitAction 함수 실행
		await submitAction(formData);
	};
	// form 제출 (useFormAction hook 사용) END ==================================================

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								FormData 전송 (useFormAction 훅 사용)
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							현재 화면은 <strong>Client Component</strong>입니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>Client Component</strong>에서 <strong>FormData</strong> 제출을 위한 방법으로{' '}
							<strong>useFormAction</strong>을 사용한 예제입니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>useFormAction</strong>훅은 프로젝트에서 자체적으로 제공하는 커스텀 훅 입니다. 폼 제출 처리 로직을
							간결하게 구현할 수 있습니다.
						</p>
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
									Form 제출 예제
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Client Component</strong>에서 <strong>FormData</strong> 제출을 위한 방법으로{' '}
								<strong>useFormAction 훅</strong>을 사용하면 코드가 훨씬 간결해지고, 로딩, 에러 처리 또한 편리해집니다.
							</p>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">
									폼 제출 처리 흐름
								</h4>

								<div className="flex justify-center py-1">
									<Image
										src={clientFormDiagram}
										alt="Client Form useFormAction Hook Diagram"
										width={700}
										height={485}
									/>
								</div>
							</div>
							<div className="w-full flex-1 py-4">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight sm:text-xl xl:text-xl">예제 코드</h4>

								<div className="flex justify-center py-1">
									<RunCodeblock
										codeTemplate={`// ========================================================
// SamplePage.tsx
// ========================================================
'use client';

import { useState } from 'react';
import { postsAction } from './postsAction';
import { useFormAction } from '@hooks/api';

function SamplePage({ searchParams }) {
	const { loading, data, error, submitAction, reset } = useFormAction(postsAction);

	// form의 onSubmit 이벤트 처리 핸들러
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // 기본 폼 제출 방지

		// FormData 직접 생성
		const formData = new FormData(e.currentTarget);
		// submitAction 함수 실행
		await submitAction(formData);
	};

	return (
		<div>
			<form onSubmit={(e) => handleSubmit(e)}>
				<input name="id" defaultValue="1" />
				<input name="title" defaultValue="제목 1" />
				<textarea name="body" defaultValue="내용 1" />
				<button type="submit">{loading ? '전송 중...' : 'POST 요청 보내기'}</button>
			</form>
			{/* 폼 제출 결과 표시 부분 */}
			<pre>
				{data ? (
					(() => {
						try {
							return JSON.stringify(data, null, 2);
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
												onSubmit={(e) => handleSubmit(e)}
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
															{data ? (
																(() => {
																	try {
																		return JSON.stringify(data, null, 2);
																	} catch {
																		return <span className="text-neutral-400">결과 없음</span>;
																	}
																})()
															) : (
																<span className="text-neutral-400">
																	결과 없음{error ? JSON.stringify(error, null, 2) : ''}
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
					</div>
				</div>
			</div>
		</>
	);
};

ClientFormHookEx.displayName = 'ClientFormHookEx';
export default ClientFormHookEx;
