'use client';

import type { IComponent } from '@app-types/common';
import type { JSX } from 'react';
import { useState } from 'react';

//import { Alert, AlertDescription, AlertTitle } from '@components/shadcn/ui/alert';
import { Button } from '@components/ui';
import { Card, CardContent } from '@components/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/shadcn/ui/tabs';
//import { AlertCircleIcon } from 'lucide-react';
import { Separator } from '@components/shadcn/ui/separator';
import { Textarea } from '@components/shadcn/ui/textarea';
import { Label } from '@components/shadcn/ui/label';

import UICodeBlock from '@/shared/components/common/ui/UICodeBlock';
import Image from 'next/image';
import useApiEx01Image from '@assets/images/ex/useApiEx01.png';
import useApiEx02Image from '@assets/images/ex/useApiEx02.png';

// =====================================
import { useApi } from '@hooks/api';
// =====================================

interface IPost {
	id: number;
	title: string;
	body: string;
}

interface IPhoto {
	albumId: number;
	id: number;
	title: string;
	url: string;
	thumbnailUrl: string;
}

interface IUseApiExProps {
	test?: string;
}

const UseApiEx: IComponent<IUseApiExProps> = (): JSX.Element => {
	const [id, setId] = useState<number>(1);

	// basic useApi example ========================================================
	const { data: basicUseApiData } = useApi<IPost[]>(`${process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL}/posts`);
	//==============================================================================
	// useApi(with enabled, refetch) example =======================================
	const { data: allPhotosUseApiData, refetch: refetchPhotos } = useApi<IPhoto[]>(
		`${process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL}/photos`,
		{
			queryOptions: { enabled: false },
		},
	);
	const photosUseApiData = Array.isArray(allPhotosUseApiData) ? allPhotosUseApiData.slice(0, 10) : allPhotosUseApiData;
	//==============================================================================
	// useApi(동적쿼리) example =====================================================
	// posts 데이터 조회 (id 파라미터 사용)
	const { data: postsDataById } = useApi<IPost>(`${process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL}/posts/${id}`);
	//==============================================================================

	const {
		data: usersData,
		refetch: refetchUsers,
		isLoading: isLoadingUsers,
		error: usersError,
	} = useApi<any[]>(`${process.env.NEXT_PUBLIC_ROUTE_API_URL}/example/api/users`);

	// api 호출(/photos) 버튼 클릭 handler
	const handlerCallPhotosAPI = () => {
		refetchPhotos();
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

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">useApi</h1>
							{usersData?.map((user) => (
								<li key={user.id}>
									{user.name} ({user.email})
								</li>
							))}
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							React Query(TanStack Query) 기반으로 구축된 <strong>REST API 호출용 커스텀 훅</strong>입니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							내부적으로 axios와 fetch를 활용하여 GET, POST, PUT, DELETE 등 다양한 HTTP 메서드를 지원합니다. 자동 캐싱,
							로딩/에러 상태 관리, 백그라운드 재검증, refetch 등 강력한 데이터 페칭 기능을 제공하며, TypeScript 제네릭을
							통해 API 응답 데이터의 타입 안정성을 보장합니다.
						</p>
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
									Basic useApi
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>useApi</strong> 훅은 Client Component의 함수 본문(최상단)에서 호출하면 Client Component가 최초
								렌더링 시, <strong>자동으로 API 요청</strong>을 보내고 결과(데이터, 로딩, 에러 상태 등)를 반환합니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								다음 예제는
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none">
									https://jsonplaceholder.typicode.com/posts
								</code>
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
									<Card className="mb-4">
										<CardContent className="flex items-center justify-center">
											<div className="grid w-full gap-2">
												<Label htmlFor="message-2">
													useApi('https://jsonplaceholder.typicode.com/posts') 호출 결과 데이터
												</Label>
												<Textarea
													value={JSON.stringify(basicUseApiData || [], null, 2)}
													placeholder="Response Data (https://jsonplaceholder.typicode.com/posts)"
													onChange={handlerTextarea}
													className="h-60"
												/>
											</div>
										</CardContent>
									</Card>
									<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
										Chrome 개발자 도구의 Network 탭에서 다음과 같이 요청이 발생하는 것을 확인할 수 있습니다.
									</p>
									<Card>
										<CardContent className="flex items-center justify-center">
											<div className="flex justify-center w-full">
												<Image
													src={useApiEx01Image}
													alt="Chrome 개발자 도구의 Network 탭 예제 이미지"
													className="w-[60%] h-auto max-w-full rounded-md border"
													style={{ maxWidth: '60%' }}
													priority
												/>
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
												{`import { useApi } from '@hooks/api';

interface IPost {
	id: number;
	title: string;
	body: string;
}

function SamplePage() {
	// useApi 훅 사용
	const { data: basicUseApiData } = useApi<IPost[]>('https://jsonplaceholder.typicode.com/posts');

	return (
		<Textarea
			value={JSON.stringify(basicUseApiData || [], null, 2)}
			className="h-60"
		/>
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
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									useApi(with enabled, refetch)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>useApi</strong> 훅의 <strong>자동으로 API 요청</strong>을 막고(enabled: false),{' '}
								<strong>refetch</strong> 함수를 호출하여 <strong>수동으로 API 요청</strong>을 보낼 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								다음 예제와 같이 <strong>Button</strong>을 누르면{' '}
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] wrap-break-word outline-none">
									https://jsonplaceholder.typicode.com/photos
								</code>{' '}
								로 데이터를 가져오기 위한 요청을 보낼 수 있습니다.
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
												<Label htmlFor="message-2">
													useApi('https://jsonplaceholder.typicode.com/photos') 호출 결과 데이터
												</Label>
												<Textarea
													value={JSON.stringify(photosUseApiData || [], null, 2)}
													className="h-60"
													placeholder="Response Data (https://jsonplaceholder.typicode.com/photos)"
													onChange={handlerTextarea}
												/>
												<Button onClick={handlerCallPhotosAPI}>Send API(/photos)</Button>
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
												{`import { useApi } from '@hooks/api';

interface IPhoto {
	albumId: number;
	id: number;
	title: string;
	url: string;
	thumbnailUrl: string;
}

function SamplePage() {
	// useApi 훅 사용
	const { data: photosUseApiData, refetch: refetchPhotos } = useApi<IPhoto[]>(
		'https://jsonplaceholder.typicode.com/photos',
		{
			queryOptions: { enabled: false },
		},
	);

	// api 호출(/photos) 버튼 클릭 handler
	const handlerCallPhotosAPI = () => {
		refetchPhotos();
	};

	return (
		<Textarea
			value={JSON.stringify(photosUseApiData || [], null, 2)}
			className="h-60"
		/>
		<Button onClick={handlerCallPhotosAPI}>Send API(/photos)</Button>
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
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									useApi(Dynamic Query("동적 쿼리"))
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								useApi 훅에서 동적 쿼리를 사용하여 API를 호출할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Button</strong>을 누르면 id값을 동적으로 변경하여 <strong>API 요청</strong>을 보낼 수 있습니다.
								URL 형식은 다음과 같이 템플릿 리터럴(Template Literal)을 사용하여 동적으로 변경할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[1.5rem] wrap-break-word outline-none font-bold">
									`https://jsonplaceholder.typicode.com/posts/$&#123;id&#125;`
								</code>{' '}
							</p>
							<p className="text-blue-600 text-[1.05rem] text-balance sm:text-base">
								&#8251; <strong>enabled</strong> 옵션을 <strong>false</strong>로 설정하고, <strong>refetch</strong>{' '}
								함수를 호출하여 <strong>API 요청</strong>을 보내면 버튼을 눌렀을 때만 API 요청이 발생하게 처리할 수
								있습니다.
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
												<Label htmlFor="message-2">
													useApi('https://jsonplaceholder.typicode.com/posts/&#123;id&#125;') 호출 결과 데이터
												</Label>
												<Label htmlFor="message-2">선택된 id: {id}</Label>
												<Textarea
													value={JSON.stringify(postsDataById)}
													className="h-30"
													placeholder="Response Data (https://jsonplaceholder.typicode.com/posts/{id})"
													onChange={handlerTextarea}
												/>
												<div className="flex flex-wrap gap-2">
													<Button
														className="flex-1 min-w-[120px]"
														onClick={() => handlerCallPostsByIdAPI(1)}
													>
														Send API(post 1)
													</Button>
													<Button
														className="flex-1 min-w-[120px]"
														onClick={() => handlerCallPostsByIdAPI(2)}
													>
														Send API(post 2)
													</Button>
													<Button
														className="flex-1 min-w-[120px]"
														onClick={() => handlerCallPostsByIdAPI(3)}
													>
														Send API(post 3)
													</Button>
												</div>
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
												{`import { useApi } from '@hooks/api';

interface IPost {
	id: number;
	title: string;
	body: string;
}

function SamplePage() {
	const [id, setId] = useState<number>(1);

	// useApi 훅 사용
	// posts 데이터 조회 (id 파라미터 사용)
	const { data: postsDataById } = useApi<IPost>(\`https://jsonplaceholder.typicode.com/posts/$\{id\}\`);

	// api 호출 버튼 클릭 handler
	const handlerCallPostsByIdAPI = (id: number) => {
		setId(id);
	};

	return (
		<Textarea
			value={JSON.stringify(postsDataById)}
			className="h-30"
			onChange={handlerTextarea}
		/>
		<Button onClick={() => handlerCallPostsByIdAPI(1)}>
			Send API(post 1)
		</Button>
		<Button onClick={() => handlerCallPostsByIdAPI(2)}>
			Send API(post 2)
		</Button>
		<Button onClick={() => handlerCallPostsByIdAPI(3)}>
			Send API(post 3)
		</Button>
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
									<Label htmlFor="message-2">"/posts/{id}" 결과 데이터를 이용하여 화면 그리기 예제</Label>
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
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							Chrome 개발자 도구의 TanStack Query(확장팩) 탭에서 다음과 같이 요청 데이터가 표시되는 것을 확인할 수
							있습니다.
						</p>
						<Card>
							<CardContent className="flex items-center justify-center">
								<div className="flex justify-center w-full">
									<Image
										src={useApiEx02Image}
										alt="Chrome 개발자 도구의 TanStack Query 탭 예제 이미지"
										className="w-[70%] h-auto max-w-full rounded-md border"
										style={{ maxWidth: '70%' }}
										priority
									/>
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

UseApiEx.displayName = 'UseApiEx';
export default UseApiEx;
