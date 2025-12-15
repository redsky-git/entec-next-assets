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
//import Image from 'next/image';
//import ServerApiEx01Image from '@assets/images/ex/ServerApiEx01.png';
//import ServerApiEx02Image from '@assets/images/ex/ServerApiEx02.png';
//import ServerApiEx03Image from '@assets/images/ex/ServerApiEx03.png';
//import ServerApiEx04Image from '@assets/images/ex/ServerApiEx04.png';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';
import { Icon, Alert, AlertDescription, AlertTitle } from '@components/ui';

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

interface IUser {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
	website: string;
	province: string;
	city: string;
	district: string;
	street: string;
	zipcode: string;
	createdAt: string;
	updatedAt: string;
}

interface IServerApiExProps {
	test?: string;
}

const ServerApiEx: IComponent<IServerApiExProps> = (): JSX.Element => {
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
	// useApi(route handler 사용) example ===========================================
	const {
		data: usersData,
		//refetch: refetchUsers,
		//isLoading: isLoadingUsers,
		//error: usersError,
	} = useApi<IUser[]>('@routes/example/api/users');
	//==============================================================================

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
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">serverApi</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>serverApi</strong> 함수는 Server Component나 Server Action에서 사용되는 API 호출 함수입니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							내부적으로 fetch 기반의 API 호출을 수행합니다.
						</p>
						<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
							<Icon
								name="MessageCircleWarning"
								className="text-blue-600 dark:text-blue-400"
							/>
							<AlertTitle className="text-blue-900 dark:text-blue-100">serverApi 사용 이유</AlertTitle>
							<AlertDescription className="text-blue-800 dark:text-blue-200">
								<div className="flex flex-col gap-2">
									{/*<p className="text-sm">...</p>*/}
									<ul className="list-disc list-inside text-sm space-y-1">
										<li>
											<strong>CORS 이슈 방지 : </strong>클라이언트에서 직접 외부 API(Domain이 다른 API)를 호출하면
											CORS(Cross-Origin Resource Sharing) 정책으로 인해 차단될 수 있습니다. serverApi는 서버에서
											실행되므로 CORS 제약이 없습니다.
										</li>
										<li>
											<strong>Next.js 캐싱 및 ISR(Incremental Static Regeneration) 지원 : </strong>serverApi는 Next.js의
											확장된 fetch 옵션을 사용할 수 있습니다:
											<ul className="list-disc list-inside text-sm space-y-1 pl-4 border-l-2 border-blue-500">
												<li>revalidate : 지정된 시간(초) 후 데이터를 재검증 (ISR)</li>
												<li>tags : 특정 태그로 캐시를 그룹화하여 revalidateTag()로 수동 무효화 가능</li>
											</ul>
										</li>
										<li>
											<strong>SEO 최적화 : </strong>serverApi로 가져온 데이터는 서버에서 HTML에 포함되어 전달되므로 검색
											엔진이 콘텐츠를 크롤링할 수 있습니다.
										</li>
										<li>
											<strong>보안 강화 : </strong>API 키, 인증 토큰 등 민감한 정보를 클라이언트에 노출하지 않음. 또한
											서버에서만 실행되므로 Network 탭에서 외부 API URL이 직접 노출되지 않음
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
							<AlertTitle className="text-blue-900 dark:text-blue-100">언제 serverApi를 사용해야 할까?</AlertTitle>
							<AlertDescription className="text-blue-800 dark:text-blue-200">
								<div className="flex flex-col gap-2">
									{/*<p className="text-sm">...</p>*/}
									<ul className="list-disc list-inside text-sm space-y-1">
										<li>
											<strong>serverApi 사용 권장 상황 : </strong>
											<div className="bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded text-sm space-y-1">
												<div className="flex">
													<span className="font-semibold">Route Handler 구현 : </span>
													<span> &nbsp;외부 API를 프록시하여 CORS 해결</span>
												</div>
												<div className="flex">
													<span className="font-semibold">Server Component에서 데이터 페칭 : </span>
													<span> &nbsp;SSR/SSG를 통한 초기 렌더링 최적화</span>
												</div>
												<div className="flex">
													<span className="font-semibold">Server Action에서 데이터 처리 : </span>
													<span> &nbsp;폼 제출, 데이터 변경 등 서버 액션</span>
												</div>
												<div className="flex">
													<span className="font-semibold">SEO가 중요한 페이지 : </span>
													<span> &nbsp;검색 엔진 크롤링을 위한 서버 렌더링</span>
												</div>
												<div className="flex">
													<span className="font-semibold">민감한 API 키 사용 : </span>
													<span> &nbsp;클라이언트 노출 방지</span>
												</div>
												<div className="flex">
													<span className="font-semibold">캐싱/재검증이 필요한 경우 : </span>
													<span> &nbsp;ISR, 태그 기반 캐시 무효화</span>
												</div>
											</div>
										</li>
										<li>
											<strong>useApi (클라이언트) 사용이 적합한 상황 : </strong>
											<div className="bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded text-sm space-y-1">
												<div className="flex">
													<span className="font-semibold">사용자 인터랙션 기반 데이터&nbsp;:&nbsp;</span>
													<span>버튼 클릭, 무한 스크롤 등</span>
												</div>
												<div className="flex">
													<span className="font-semibold">실시간 데이터 갱신&nbsp;:&nbsp;</span>
													<span>폴링, 동적 쿼리</span>
												</div>
												<div className="flex">
													<span className="font-semibold">클라이언트 상태와 연동&nbsp;:&nbsp;</span>
													<span>로그인 상태, 사용자 입력 기반 요청</span>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</AlertDescription>
						</Alert>
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
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] wrap-break-word outline-none">
									https://jsonplaceholder.typicode.com/posts
								</code>
								로 데이터를 가져오기 위한 요청을 보냅니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<RunCodeblock
								title="useApi('https://jsonplaceholder.typicode.com/posts') 호출 결과 데이터"
								codeTemplate={`import { useApi } from '@hooks/api';

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
							>
								<Textarea
									value={JSON.stringify(basicUseApiData || [], null, 2)}
									placeholder="Response Data (https://jsonplaceholder.typicode.com/posts)"
									onChange={handlerTextarea}
									className="h-60 rounded-t-md rounded-b-none border-b-0"
								/>
							</RunCodeblock>
							<div className="flex flex-col gap-2 pt-6">
								<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
									Chrome 개발자 도구의 Network 탭에서 다음과 같이 요청이 발생하는 것을 확인할 수 있습니다.
								</p>
							</div>
							<Card>
								<CardContent className="flex items-center justify-center">
									<div className="flex justify-center w-full">
										{/*<Image
											src={ServerApiEx01Image}
											alt="Chrome 개발자 도구의 Network 탭 예제 이미지"
											className="w-[60%] h-auto max-w-full rounded-md border"
											style={{ maxWidth: '60%' }}
											priority
										/>*/}
									</div>
								</CardContent>
							</Card>
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
									{/*<Image
										src={ServerApiEx02Image}
										alt="Chrome 개발자 도구의 TanStack Query 탭 예제 이미지"
										className="w-[70%] h-auto max-w-full rounded-md border"
										style={{ maxWidth: '70%' }}
										priority
									/>*/}
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
									useApi(Route Handler 사용 예제)
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								useApi 훅에서 Route Handler를 사용하여 API를 호출할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[1.1rem] wrap-break-word outline-none font-bold">
									`src/app/(domains)/example/api/users`
								</code>
								디렉토리에{' '}
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[1.1rem] wrap-break-word outline-none font-bold">
									`route.ts`
								</code>{' '}
								파일을 만들어 서버로 API를 요청하는 Route Handler를 먼저 구현합니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								이렇게 구현 되어있는 Router Handler를 `useApi` 훅에서 사용하여 API를 호출할 수 있습니다.
							</p>
							<p className="text-blue-600 text-[1.05rem] text-balance sm:text-base">
								Router Handler에서 구현된 API임을 구분하기 위해 <strong>endpoint 파라미터</strong> 앞에{' '}
								<strong>@routes</strong> 접두사를 붙입니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<RunCodeblock
								title="useApi('@routes/example/api/users') Route Handler 사용 예제"
								codeTemplate={`// ========================================================
// 화면 코드
// ========================================================
import { useApi } from '@hooks/api';

interface IUser {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
	website: string;
	province: string;
	city: string;
	district: string;
	street: string;
	zipcode: string;
	createdAt: string;
	updatedAt: string;
}

function SamplePage() {
	// useApi 훅(Route Handler) 사용
	const { data: usersData } = useApi<IUser[]>('@routes/example/api/users');

	return (
		<Textarea
			value={JSON.stringify(usersData || [], null, 2)}
			className="h-60"
		/>
	);
}

// ========================================================
// src/app/(domains)/example/api/users/route.ts
// ========================================================
import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/core/common/api/server-api';

/**
 * GET /example/api/users
 * koreanjson.com의 users 데이터를 가져옵니다.
 */
export async function GET(_request: NextRequest) {
	try {
		// serverApi를 사용하여 외부 API 호출
		const response = await serverApi<any[]>(
			'https://koreanjson.com/users',
			{
				method: 'GET',
			},
			{
				revalidate: 0, // 항상 최신 데이터 fetch (SSR, 캐싱 X)
				tags: ['users', 'financial'], // 데이터 분류 및 감사 추적을 위한 다중 태그
			},
		);

		// 성공 응답
		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		// 에러 응답
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : '사용자 목록을 가져오는데 실패했습니다.',
				data: null,
			},
			{ status: 500 },
		);
	}
}`}
							>
								<Textarea
									value={JSON.stringify(usersData || [], null, 2)}
									placeholder="Response Data (https://jsonplaceholder.typicode.com/posts)"
									onChange={handlerTextarea}
									className="h-60 rounded-t-md rounded-b-none border-b-0"
								/>
							</RunCodeblock>
						</div>
						{/* example 블럭요서 END */}
						{/* API 호출 결과 데이터를 이용하여 화면 그리기 예제 START */}
						<Card className="mt-4">
							<CardContent className="flex items-center justify-center">
								<div className="grid w-full gap-2">
									<Label htmlFor="message-2">"@routes/example/api/users" 결과 데이터를 이용하여 화면 그리기 예제</Label>
									{Array.isArray(usersData) && usersData.length > 0 ? (
										<div className="rounded-lg border bg-background p-4 shadow-sm">
											<ul
												className="divide-y divide-border overflow-y-auto"
												style={{ maxHeight: 340 }}
											>
												{usersData.map((user: IUser) => (
													<li
														key={user.id}
														className="py-4 flex items-start gap-4 hover:bg-accent/30 transition-colors rounded-md px-2"
													>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<span className="font-semibold text-primary">
																	{user.name || `이름 없음`}
																	{` (${user.email})`}
																</span>
																<span className="text-xs text-muted-foreground">{`#${user.phone}`}</span>
															</div>
															<p className="text-sm text-muted-foreground">
																{user.city ? (
																	<span className="italic">{`${user.province} ${user.city} ${user.district} ${user.street}`}</span>
																) : (
																	<span className="italic">본문 없음</span>
																)}
															</p>
														</div>
													</li>
												))}
											</ul>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
											<p>불러온 데이터가 없습니다. user 데이터를 가져오세요.</p>
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
									{/*<Image
										src={ServerApiEx03Image}
										alt="Chrome 개발자 도구의 TanStack Query 탭 예제 이미지"
										className="w-[70%] h-auto max-w-full rounded-md border"
										style={{ maxWidth: '70%' }}
										priority
									/>*/}
								</div>
							</CardContent>
						</Card>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							Chrome 개발자 도구의 Network 탭에서 다음과 같이 users 데이터를 요청하는 것을 확인할 수 있습니다. 또한
							Route Handler로 구현된 API를 호출하면 CORS 이슈가 발생하지 않습니다.
						</p>
						<ul className="list-inside list-disc text-sm">
							<li>Route Handler로 구현된 API는 App Router 경로를 그대로 사용합니다. ex) /example/api/users</li>
							<li>
								Route Handler로 구현된 API는 클라이언트에서 호출할 때 @routes 접두사를 붙여서 호출합니다. ex)
								useApi('@routes/example/api/users')
							</li>
							<li>
								network 탭에서 호출된 API 요청 경로를 확인해 보면 Next.js 경로와 동일한 경로로 호출되는 것을 확인할 수
								있습니다. 왜냐하면 Route Handler로 구현된 API는 Next.js 서버에서 실행되기 때문입니다.
							</li>
						</ul>
						<Card>
							<CardContent className="flex items-center justify-center">
								<div className="flex justify-center w-full">
									{/*<Image
										src={ServerApiEx04Image}
										alt="Chrome 개발자 도구의 Network 탭 예제 이미지"
										className="w-[70%] h-auto max-w-full rounded-md border"
										style={{ maxWidth: '70%' }}
										priority
									/>*/}
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

ServerApiEx.displayName = 'ServerApiEx';
export default ServerApiEx;
