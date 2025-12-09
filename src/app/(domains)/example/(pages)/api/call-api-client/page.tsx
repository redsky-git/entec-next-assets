'use client';

import type { IComponent } from '@app-types/common';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

//import { Alert, AlertDescription, AlertTitle } from '@components/shadcn/ui/alert';
import { Button } from '@components/ui';
import { Card, CardContent } from '@components/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/shadcn/ui/tabs';
//import { AlertCircleIcon } from 'lucide-react';
import { Separator } from '@components/shadcn/ui/separator';
import { Textarea } from '@components/shadcn/ui/textarea';
import { Label } from '@components/shadcn/ui/label';

import UICodeBlock from '@/shared/components/common/ui/UICodeBlock';
// =====================================
import { useApiQuery } from './_common/common-api';
//import { qkey } from './_common/queryKeyFactory';
// =====================================

interface IPost {
	id: number;
	title: string;
	body: string;
}

interface ICallApiClientExProps {
	test?: string;
}

const CallApiClientEx: IComponent<ICallApiClientExProps> = (): JSX.Element => {
	const [id, setId] = useState<number>(1);
	// posts 데이터 조회
	const { data: postsData, refetch } = useApiQuery<IPost[]>('posts');
	//const { data: postsData, refetch } = useApiQuery<IPost[]>('posts', {
	//	method: 'POST',
	//	body: {
	//		title: 'test title',
	//		body: 'test body',
	//		userId: 1,
	//	},
	//});
	// posts 데이터 조회 (id 파라미터 사용)
	const { data: postsDataById, refetch: refetchPostsById } = useApiQuery<IPost>(`posts/${id}`);

	// api 호출 버튼 클릭 handler
	const handlerCallAPI = () => {
		refetch();

		//const queryKey = qkey`posts/${id}`({ status: 'active' });
		//console.log(queryKey);
	};

	const handlerCallPostsByIdAPI = (id: number) => {
		setId(id);
		//setTimeout(() => {
		//	refetchPostsById();
		//}, 1000);
	};

	// textarea onChange handler
	const handlerTextarea = () => {
		//
	};

	// useEffect hooks
	useEffect(() => {
		// ...
	}, []);

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								Client API (client) 호출 테스트
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">ㅁㅁㅁㅁㅁㅁㅁㅁ</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">ㅁㅁㅁㅁㅁㅁㅁㅁ</p>
					</div>
					<div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
						<Separator className="my-6" />
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									API 호출 예제
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Button</strong>을 누르면{' '}
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] wrap-break-word outline-none">
									https://jsonplaceholder.typicode.com/posts
								</code>{' '}
								로 데이터를 가져오기 위한 요청을 보냅니다.
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
										<CardContent className="flex items-center justify-center">
											<div className="grid w-full gap-2">
												<Label htmlFor="message-2">결과 데이터</Label>
												<Textarea
													value={`Response Data (api서버 도메인/posts) : ${JSON.stringify(postsData)}`}
													className="h-60"
													placeholder="Response Data (api서버 도메인/api/v1/search)"
													onChange={handlerTextarea}
												/>
												<Button onClick={handlerCallAPI}>Send API</Button>
												{/*<Button onClick={handlerInitData}>결과 데이터 초기화</Button>*/}
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card>
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`
function SamplePage() {
	return (
		<>
		</>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* API 호출 결과 데이터를 이용하여 화면 그리기 예제 START */}
						<Card className="mt-4">
							<CardContent className="flex items-center justify-center">
								<div className="grid w-full gap-2">
									<Label htmlFor="message-2">posts결과 데이터를 이용하여 화면 그리기 예제</Label>
									{Array.isArray(postsData) && postsData.length > 0 ? (
										<div className="rounded-lg border bg-background p-4 shadow-sm">
											<ul
												className="divide-y divide-border overflow-y-auto"
												style={{ maxHeight: 340 }}
											>
												{postsData.map((post: IPost) => (
													<li
														key={post.id}
														className="py-4 flex items-start gap-4 hover:bg-accent/30 transition-colors rounded-md px-2"
													>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<span className="font-semibold text-primary">{post.title || `제목 없음`}</span>
																<span className="text-xs text-muted-foreground">{`#${post.id}`}</span>
															</div>
															<p className="text-sm text-muted-foreground">
																{post.body ? post.body : <span className="italic">본문 없음</span>}
															</p>
														</div>
													</li>
												))}
											</ul>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
											<p>불러온 데이터가 없습니다. 위의 "Send API" 버튼을 눌러 데이터를 가져오세요.</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
						{/* API 호출 결과 데이터를 이용하여 화면 그리기 예제 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									API 호출 예제(/posts/{id})
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Button</strong>을 누르면{' '}
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] wrap-break-word outline-none">
									https://jsonplaceholder.typicode.com/posts/{id}
								</code>{' '}
								로 데이터를 가져오기 위한 요청을 보냅니다.
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
										<CardContent className="flex items-center justify-center">
											<div className="grid w-full gap-2">
												<Label htmlFor="message-2">결과 데이터</Label>
												<Textarea
													value={`Response Data (api서버 도메인/posts/{id}) : ${JSON.stringify(postsDataById)}`}
													className="h-60"
													placeholder="Response Data (api서버 도메인/api/v1/search)"
													onChange={handlerTextarea}
												/>
												<Button onClick={() => handlerCallPostsByIdAPI(1)}>Send API(post 1)</Button>
												<Button onClick={() => handlerCallPostsByIdAPI(2)}>Send API(post 2)</Button>
												<Button onClick={() => handlerCallPostsByIdAPI(3)}>Send API(post 3)</Button>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card>
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`
function SamplePage() {
	return (
		<>
		</>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* API 호출 결과 데이터를 이용하여 화면 그리기 예제 START */}
						<Card className="mt-4">
							<CardContent className="flex items-center justify-center">
								<div className="grid w-full gap-2">
									<Label htmlFor="message-2">posts결과 데이터를 이용하여 화면 그리기 예제</Label>
									{postsDataById ? (
										<div className="rounded-lg border bg-background p-4 shadow-sm">
											<ul
												className="divide-y divide-border overflow-y-auto"
												style={{ maxHeight: 340 }}
											>
												<li
													key={postsDataById.id}
													className="py-4 flex items-start gap-4 hover:bg-accent/30 transition-colors rounded-md px-2"
												>
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-semibold text-primary">{postsDataById.title || `제목 없음`}</span>
															<span className="text-xs text-muted-foreground">{`#${postsDataById.id}`}</span>
														</div>
														<p className="text-sm text-muted-foreground">
															{postsDataById.body ? postsDataById.body : <span className="italic">본문 없음</span>}
														</p>
													</div>
												</li>
											</ul>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
											<p>불러온 데이터가 없습니다. 위의 "Send API" 버튼을 눌러 데이터를 가져오세요.</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
						{/* API 호출 결과 데이터를 이용하여 화면 그리기 예제 END */}
					</div>
				</div>
			</div>
		</>
	);
};

CallApiClientEx.displayName = 'CallApiClientEx';
export default CallApiClientEx;
