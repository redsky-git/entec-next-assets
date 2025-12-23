import type { IComponent } from '@/core/types/common';
import type { JSX } from 'react';

import { use } from 'react';
import { Card, CardContent } from '@/core/components/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/shadcn/ui/tabs';
import { Separator } from '@/core/components/shadcn/ui/separator';

import UICodeBlock from '@/shared/components/common/ui/UICodeBlock';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';

import { postsAction } from './postsAction';
import { cookies } from 'next/headers';
import Image from 'next/image';
import serverFormDiagram from '@/assets/images/ex/serverForm01.svg';

interface IServerFormExProps {
	searchParams?: Promise<any>;
}

const ServerFormEx: IComponent<IServerFormExProps> = ({ searchParams }: IServerFormExProps): JSX.Element => {
	const resultPostsCookie = use(cookies()).get('result_posts');
	// Next.js 15에서 searchParams는 Promise이므로 use()로 unwrap 필요
	const resolvedSearchParams = searchParams ? use(searchParams) : {};
	console.log('=========searchParams:::', JSON.stringify(resolvedSearchParams));
	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								FormData 전송 (Server Component)
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							현재 화면은 <strong>Server Component</strong>입니다. 모든 처리는 <strong>Server</strong>에서 처리됩니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>Server Component</strong>에서 <strong>FormData</strong>를 <strong>Server Action</strong>으로
							전달하고, <strong>Server Action</strong>에서는 <strong>FormData</strong>를 파싱하여{' '}
							<strong>REST API</strong>를 호출하는 과정의 예제입니다.
						</p>
					</div>
					<div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
						<div className="w-full flex-1 py-4">
							<h2
								data-shorcut="true"
								className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
							>
								폼 제출 처리 흐름
							</h2>

							<div className="flex justify-center py-1">
								<Image
									src={serverFormDiagram}
									alt="Server Form Diagram"
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
┌─────────────────────────────────────────────────┐
│   1.  사용자 폼 입력 & 제출 (Server Component)      │
│                                                 │
│    <form action={postsAction}>                  │
│      [ID] [제목] [내용] [제출 버튼]                  │
│    </form>                                      │
└────────────────────┬────────────────────────────┘
                     │ FormData 전송
                     ▼
┌─────────────────────────────────────────────────┐
│    2.  Server Action (postsAction.ts)           │
│                                                 │
│  • FormData 파싱 (id, title, body)               │
│  • serverApi() → REST API 호출                   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│    3.  REST API 응답 (API 서버)                   │
│                                                 │
│  { id: 101, title: "...", body: "..." }         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│    4.  결과 저장 & Redirect                       │
│                                                 │
│  • 쿠키 저장: 전체 응답 데이터 또는,                    │
│     query parameter를 통해 전달                    │
│    (redirect: ?success=true&message=...&id=101) │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│    5.  서버에서 리렌더링 & 브라우저로 전달              │
│        (Server Component - page.tsx)            │
│                                                 │
│  • use(cookies()).get('result_posts')           │
│  • use(searchParams) → { success, message }     │
│                                                 │
│  → 렌더링된 HTML을 브라우저로 전달 → 결과 화면 표시       │
└─────────────────────────────────────────────────┘
							`}
							/>*/}
						</div>
						<Separator className="my-6" />
						{/* example 블럭요소 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									Form 전송 예제
								</h2>

								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								Form 제출 처리 실제 구현 예제입니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>'https://jsonplaceholder.typicode.com/posts'</strong> 주소로 POST 요청을 보내고 결과를 받습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								REST API 응답 결과값은 <strong>쿠키</strong>에 저장하거나, <strong>query parameter</strong>를 통해
								전달하여 <strong>redirect</strong> 함수를 통해 페이지 이동하여 결과를 표시합니다. 프로젝트 상황에 따라
								적절한 방법을 선택하면 됩니다.
							</p>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
							<RunCodeblock
								title="'https://jsonplaceholder.typicode.com/posts' 호출"
								codeTemplate={`// ========================================================
// SamplePage.tsx
// 상황에 따라 쿠키를 사용하거나 query parameter를 사용하여 결과를 전달할 수 있습니다.
// ========================================================
import { serverApi } from '@fetch/server-api';
import { postsAction } from './postsAction';
import { cookies } from 'next/headers';

function SamplePage({ searchParams }) {
	// 쿠키에서 결과 읽어옴 (결과 화면에서 쿠키에서 읽어옴)
	const resultPostsCookie = use(cookies()).get('result_posts');
	// Next.js 15에서 searchParams는 Promise이므로 use()로 unwrap 필요 (결과 화면에서 쿼리 파라미터를 읽어옴)
	const resolvedSearchParams = searchParams ? use(searchParams) : {};
	
	return (
		<div>
			<form action={postsAction as any}>
				<input name="id" defaultValue="1" />
				<input name="title" defaultValue="제목 1" />
				<textarea name="body" defaultValue="내용 1" />
				<button type="submit">POST 요청 보내기</button>
			</form>
		</div>
	);
}
	
// ========================================================
// postsAction.ts (Server Action)
// ========================================================
'use server';

import { serverApi } from '@fetch/server-api';

export async function postsAction(formData: FormData) {

	// 상황에 따라 다음과 같이 FormData를 파싱할 수 있습니다.
	const title = formData.get('title') as string;
	const body = formData.get('body') as string;
	const id = formData.get('id') as string;

	// serverApi 호출
	// formData를 직접 전달하면 serverApi가 자동으로 Content-Type: multipart/form-data를 설정합니다.
	const res = await serverApi<any>('https://jsonplaceholder.typicode.com/posts', {
		method: 'POST',
		body: formData,
		cache: 'no-store',
	});

	// api 호출 결과 성공 처리
	if (res.data) {
		// 쿠키에 결과 저장하여 전달 방법 (결과 화면에서 쿠키에서 읽어옴)
		(await cookies()).set('result_posts', JSON.stringify(res), { maxAge: 60 });

		// query parameter 포함을 위한 URLSearchParams 객체 생성 
		// (결과 화면에서 쿼리 파라미터를 읽어옴)
		const params = new URLSearchParams({
			success: 'true',
			message: '게시글이 작성되었습니다.',
			status: res?.status?.toString() || '',
			id: res.data.id?.toString() || '',
		});

		// 캐시 무효화 (필요시 주석 해제)
		// revalidatePath('/example/docs/server-form');

		// redirect 함수로 페이지 이동 (query parameter 포함)
		redirect(\`/example/docs/server-form?{\`\$\{params.toString()\}\`}\`);
	}
}
// ========================================================`}
							>
								<div className="w-full max-w-md mx-auto my-8 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800">
									<form
										className="flex flex-col gap-5"
										action={postsAction as any}
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
											POST 요청 보내기
										</button>
									</form>
									<div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 text-center">
										폼 제출 시 서버로 FormData(id, title, body)를 전송합니다.
									</div>
									<div className="mt-4">
										<div className="flex flex-col md:flex-row gap-4">
											<div className="flex-1 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
												<div className="font-semibold mb-1 text-sm text-sky-700 dark:text-sky-300 flex flex-col items-start gap-0.5">
													<span>resultPostsCookie</span>
													<span className="text-xs text-neutral-500">(쿠키에서 읽은 결과)</span>
												</div>
												<pre className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-md p-2 border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
													{resultPostsCookie ? (
														(() => {
															try {
																return JSON.stringify(JSON.parse(resultPostsCookie.value), null, 2);
															} catch {
																return resultPostsCookie.value;
															}
														})()
													) : (
														<span className="text-neutral-400">결과 없음</span>
													)}
												</pre>
											</div>
											<div className="flex-1 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
												<div className="font-semibold mb-1 text-sm text-sky-700 dark:text-sky-300 flex flex-col items-start gap-0.5">
													<span>searchParams</span>
													<span className="text-xs text-neutral-500">(쿼리 파라미터 읽은 결과)</span>
												</div>
												<pre className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-md p-2 border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
													{resolvedSearchParams && Object.keys(resolvedSearchParams).length > 0 ? (
														JSON.stringify(resolvedSearchParams, null, 2)
													) : (
														<span className="text-neutral-400">없음</span>
													)}
												</pre>
											</div>
										</div>
									</div>
								</div>
							</RunCodeblock>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5 flex items-center justify-center">...</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div>
			<Accordion
				type="single"
				collapsible
				className="w-full"
				defaultValue="item-1"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>제품 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
							탁월한 성능과 안정성을 제공합니다.
						</p>
						<p>
							주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
							인터페이스가 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>배송 세부 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
							영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
						</p>
						<p>
							모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
							실시간으로 배송 상황을 확인하실 수 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요소 END */}
						{/* example 블럭요소 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									Single 타입
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트는 단일 선택 모드인 <strong>Single</strong> 타입을 제공합니다. 이
								모드에서는 한 번에 하나의 섹션만 확장할 수 있어, 사용자가 특정 정보에 집중할 수 있도록 도와줍니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Single</strong> 타입은 특히 제한된 공간에서 여러 섹션을 제공해야 할 때 유용하며, 예제는 위{' '}
								<strong>Basic Accordion</strong> 예제와 같습니다.
							</p>
						</div>
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									Multiple 타입
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트는 다중 선택 모드인 <strong>Multiple</strong> 타입도 제공합니다. 이
								모드에서는 사용자가 여러 섹션을 동시에 확장할 수 있어, 다양한 정보를 한눈에 확인하고자 할 때 유용합니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Multiple</strong> 타입은 정보가 풍부한 대시보드나 설정 페이지에서 특히 효과적이며, 예제는 아래와
								같습니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5 flex items-center justify-center">...</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div>
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={['item-1']}
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>제품 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
							탁월한 성능과 안정성을 제공합니다.
						</p>
						<p>
							주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
							인터페이스가 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>배송 세부 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
							영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
						</p>
						<p>
							모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
							실시간으로 배송 상황을 확인하실 수 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									아이콘 변경
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트의 <strong>expandIcon prop</strong>을 사용하여{' '}
								<strong>확장 표시</strong> 아이콘을 전체적으로 변경할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionTrigger</strong> 컴포넌트의 <strong>expandIcon prop</strong>을 사용하여{' '}
								<strong>확장 표시</strong> 아이콘을 개별적으로 변경할 수 있습니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5 flex items-center justify-center">...</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div>
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={['item-1']}
				expandIcon="SquareArrowDown" // 전체적으로 확장 표시 아이콘 변경
			>
				<AccordionItem value="item-1">
					<AccordionTrigger expandIcon="SquareArrowDown">제품 정보</AccordionTrigger> // 개별적으로 확장 표시 아이콘 변경
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
							탁월한 성능과 안정성을 제공합니다.
						</p>
						<p>
							주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
							인터페이스가 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger expandIcon="SquareArrowDown">배송 세부 정보</AccordionTrigger> // 개별적으로 확장 표시 아이콘 변경
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
							영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
						</p>
						<p>
							모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
							실시간으로 배송 상황을 확인하실 수 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									Disabled 처리
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트나 <strong>AccordionItem</strong> 컴포넌트의{' '}
								<strong>disabled</strong> 속성을 사용하여 비활성화 처리할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트에 <strong>disabled</strong> 속성을 추가하면 모든 섹션이 비활성화
								됩니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionItem</strong> 컴포넌트에 <strong>disabled</strong> 속성을 추가하면 해당 섹션이 비활성화
								됩니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5 flex items-center justify-center">
											<div className="flex flex-col md:flex-row w-full gap-6">
												<div className="flex-1 flex flex-col gap-2">
													<label htmlFor="message-2">Accordion Disabled 처리</label>
													...
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div className="flex flex-col md:flex-row w-full gap-6">
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">Accordion Disabled 처리</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
					disabled
				>
					<AccordionItem value="item-1">
						<AccordionTrigger>제품 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">첫번째 AccordionItem Disabled 처리</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
				>
					<AccordionItem
						value="item-1"
						disabled
					>
						<AccordionTrigger>제품 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									animation 처리
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트는 기본적으로 애니메이션 효과가 적용되어 있습니다.{' '}
								<strong>Accordion</strong> 컴포넌트의 전체 섹션 애니메이션 효과를 비활성화하려면{' '}
								<strong>disableAnimation</strong> 속성을 사용하면 됩니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionContent</strong> 컴포넌트의 <strong>disableAnimation</strong> 속성을 사용하면 해당
								섹션의 애니메이션 효과를 비활성화할 수 있습니다. 이 속성은 개별적으로 설정할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionTrigger</strong> 컴포넌트의 <strong>disableAnimation</strong> 속성을 사용하면 해당
								섹션의 헤더 부분의 아이콘 애니메이션 효과를 비활성화할 수 있습니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5 flex items-center justify-center">
											<div className="flex flex-col md:flex-row w-full gap-6">
												<div className="flex-1 flex flex-col gap-2">
													<label htmlFor="message-2">Accordion animation 비활성화 처리</label>
													...
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div className="flex flex-col md:flex-row w-full gap-6">
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">Accordion animation 비활성화 처리</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
					disableAnimation
				>
					<AccordionItem value="item-1">
						<AccordionTrigger>제품 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">
					첫번째 AccordionTrigger, AccordionContent만 animation 비활성화 처리
				</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
				>
					<AccordionItem value="item-1">
						<AccordionTrigger disableAnimation>제품 정보</AccordionTrigger>
						<AccordionContent
							disableAnimation
							className="flex flex-col gap-4 text-balance"
						>
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									상태 관리 (value, onValueChange)
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트의 <strong>value</strong>와 <strong>onValueChange</strong> 속성을
								사용하여 상태를 관리할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>value</strong> 속성은 현재 열려있는 아코디언 항목의 고유값을 나타내며,{' '}
								<strong>onValueChange</strong> 속성은 아코디언 항목이 열리거나 닫힐 때 호출되는 콜백 이벤트 함수입니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4"></div>
						{/* example 블럭요서 END */}

						{/* 금융권 실무 예제 START */}
						<Separator className="my-8" />
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									실전 예제
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base pb-4">
								<strong>Accordion</strong> 컴포넌트를 활용한 UI 예제들입니다. 거래 내역, 약관 동의, 포트폴리오 등 다양한
								화면에서 활용 가능합니다.
							</p>
						</div>

						{/* 예제 1: 거래 내역 상세 */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									1. 거래 내역 상세
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								거래 내역 목록에서 각 거래를 클릭하면 상세 정보를 확인할 수 있습니다. 입출금, 이체, 카드결제 등 다양한
								거래 유형의 상세 정보를 효율적으로 표시할 수 있습니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5">
											<div className="mb-4">
												<h4 className="text-lg font-semibold mb-2">최근 거래 내역</h4>
												<p className="text-sm text-muted-foreground">2025년 11월</p>
											</div>
											<Separator className="my-1" />
											...
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="TransactionHistory.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function TransactionHistory() {
	return (
		<div>
			<div className="mb-4">
				<h4 className="text-lg font-semibold mb-2">최근 거래 내역</h4>
				<p className="text-sm text-muted-foreground">2025년 11월</p>
			</div>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<div className="flex justify-between items-center w-full pr-4">
							<div className="flex flex-col items-start gap-1">
								<span className="font-medium">스타벅스 강남점</span>
								<span className="text-sm text-muted-foreground">2025.11.26 10:23</span>
							</div>
							<span className="font-semibold text-red-600">-5,500원</span>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
							<div className="flex justify-between">
								<span className="text-muted-foreground">거래 유형</span>
								<span className="font-medium">카드 결제</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">카드번호</span>
								<span className="font-medium">신한 **** **** 1234</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">승인번호</span>
								<span className="font-medium">12345678</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">잔액</span>
								<span className="font-medium">1,245,500원</span>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
				{/* 추가 거래 내역... */}
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>

						{/* 예제 2: 약관 동의 */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									2. 약관 동의
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								금융 서비스 가입 시 필요한 약관들을 펼쳐서 확인하고 동의할 수 있습니다. 필수/선택 약관을 구분하여
								표시하고, 각 약관의 전문을 확인할 수 있습니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5">
											<div className="mb-4">
												<h4 className="text-lg font-semibold mb-2">계좌 개설 약관 동의</h4>
												<p className="text-sm text-muted-foreground">약관을 확인하시고 동의해 주세요</p>
											</div>
											...
											<div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
												<p className="text-sm text-blue-800 dark:text-blue-200">
													※ 필수 약관에 모두 동의하셔야 계좌 개설이 가능합니다.
												</p>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="TermsAgreement.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function TermsAgreement() {
	return (
		<div>
			<div className="mb-4">
				<h4 className="text-lg font-semibold mb-2">계좌 개설 약관 동의</h4>
				<p className="text-sm text-muted-foreground">약관을 확인하시고 동의해 주세요</p>
			</div>
			<Accordion type="multiple" className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<div className="flex items-center gap-3 w-full pr-4">
							<input
								type="checkbox"
								className="w-4 h-4"
								onClick={(e) => e.stopPropagation()}
							/>
							<span className="font-medium">[필수] 금융거래 이용약관</span>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="p-4 bg-muted/50 rounded-lg">
							<div className="h-48 overflow-y-auto text-sm space-y-3 border rounded p-3">
								<h5 className="font-semibold">제1조 (목적)</h5>
								<p className="text-muted-foreground">
									본 약관은 은행과 거래자 사이의 모든 금융거래에 관한
									기본적이고 공통적인 사항을 정함으로써...
								</p>
								{/* 약관 내용... */}
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
				{/* 추가 약관... */}
			</Accordion>
			<div className="mt-6 p-4 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-800">
					※ 필수 약관에 모두 동의하셔야 계좌 개설이 가능합니다.
				</p>
			</div>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>

						{/* 예제 3: 포트폴리오 자산 현황 */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									3. 포트폴리오 / 자산 현황
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								투자 포트폴리오나 보유 자산을 카테고리별로 구분하여 표시할 수 있습니다. 예금, 주식, 펀드, 부동산 등 자산
								유형별 상세 현황을 한눈에 파악할 수 있습니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5">
											<div className="mb-4">
												<h4 className="text-lg font-semibold mb-2">내 자산 현황</h4>
												<div className="flex items-baseline gap-2">
													<span className="text-3xl font-bold">45,782,500원</span>
													<span className="text-sm text-muted-foreground">총 자산</span>
												</div>
											</div>
											...
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="AssetPortfolio.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function AssetPortfolio() {
	return (
		<div>
			<div className="mb-4">
				<h4 className="text-lg font-semibold mb-2">내 자산 현황</h4>
				<div className="flex items-baseline gap-2">
					<span className="text-3xl font-bold">45,782,500원</span>
					<span className="text-sm text-muted-foreground">총 자산</span>
				</div>
			</div>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<div className="flex justify-between items-center w-full pr-4">
							<div className="flex flex-col items-start gap-1">
								<span className="font-semibold">예금/적금</span>
								<span className="text-sm text-muted-foreground">3개 상품</span>
							</div>
							<div className="flex flex-col items-end gap-1">
								<span className="text-lg font-bold">25,000,000원</span>
								<span className="text-xs text-green-600">+150,000원 (이자)</span>
							</div>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
							<div className="flex justify-between items-center p-3 bg-background rounded border">
								<div>
									<p className="font-medium">S-정기예금</p>
									<p className="text-sm text-muted-foreground">신한은행 | 연 3.5%</p>
									<p className="text-xs text-muted-foreground mt-1">
										만기일: 2025.12.31 (35일 남음)
									</p>
								</div>
								<div className="text-right">
									<p className="font-semibold">10,000,000원</p>
									<p className="text-sm text-green-600">+85,000원</p>
								</div>
							</div>
							{/* 추가 상품... */}
						</div>
					</AccordionContent>
				</AccordionItem>
				{/* 추가 자산 카테고리... */}
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* 금융권 실무 예제 END */}
					</div>
				</div>
			</div>
		</>
	);
};

ServerFormEx.displayName = 'ServerFormEx';
export default ServerFormEx;
