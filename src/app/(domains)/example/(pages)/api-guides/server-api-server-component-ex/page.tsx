import type { IComponent } from '@app-types/common';
import type { JSX } from 'react';
import { serverApi } from '@fetch/server-api';
import { Card, CardContent, CardHeader, CardTitle } from '@components/shadcn/ui/card';
import { Separator } from '@components/shadcn/ui/separator';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';

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

interface IServerApiServerComponentExProps {
	test?: string;
}

/**
 * Server Component Example
 * serverApi를 사용하여 서버 사이드에서 데이터를 fetching하고 렌더링합니다.
 */
const ServerApiServerComponentExPage: IComponent<IServerApiServerComponentExProps> = async (): Promise<JSX.Element> => {
	// serverApi 호출 (Server Component이므로 async/await 직접 사용 가능)
	// 캐싱 옵션: 60초 동안 캐시 유지 (ISR)
	const { data: users } = await serverApi<IUser[]>(
		'https://koreanjson.com/users',
		{ method: 'GET' },
		{ revalidate: 60 },
	);

	// 데이터 슬라이싱 (10개만)
	const recentUsers = Array.isArray(users) ? users.slice(0, 10) : [];

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								serverApi (Server Component)
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							이 페이지는 <strong>Server Component</strong>로 구현되었습니다.
							<br />
							<strong>serverApi</strong>를 사용하여 서버에서 직접 데이터를 가져와 렌더링합니다. (브라우저 네트워크
							탭에서 API 호출이 보이지 않습니다)
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
									Server Component에서 API 직접호출
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>serverApi</strong> 함수를 사용하여 API를 <strong>서버에서 직접 호출</strong>하고 결과 데이터를
								활용하여 화면을 모두 렌더링 한 후 브라우저로 전달되는 예제입니다.
							</p>
							<div className="w-full flex-1 py-4">
								<h3 className="text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl">데이터 흐름</h3>
								<RunCodeblock
									lineNumbers={false}
									showCodeBlockCopyButton={false}
									showCollapsed={false}
									rounded={false}
									codeTemplate={`
┌─────────────────────────────────────────────────────────────┐
│             Server Component (Next.js)                      │
│      (src/app/.../server-api-server-component-ex)           │
│                                                             │
│   serverApi('https://koreanjson.com/users')                 │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (서버(Node.js)에서 직접 호출)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    External API                             │
│              (https://koreanjson.com)                       │
│                                                             │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (JSON 데이터 반환 → HTML 생성)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
│                                                             │
│         (완성된 HTML을 수신하여 즉시 화면 렌더링)            │
└─────────────────────────────────────────────────────────────┘
							`}
								/>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								다음 예제는
								<code className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] wrap-break-word outline-none">
									https://koreanjson.com/users
								</code>
								로 데이터를 가져오기 위한 요청을 보냅니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<RunCodeblock
								title="serverApi('https://koreanjson.com/users') 호출 결과 데이터"
								codeTemplate={`import { serverApi } from '@fetch/server-api';

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

export default async function SamplePage() {
	// serverApi 호출 (Server Component이므로 async/await 직접 사용 가능)
	// 캐싱 옵션: 60초 동안 캐시 유지 (ISR)
	const { data: users } = await serverApi<IUser[]>(
		'https://koreanjson.com/users',
		{ method: 'GET' },
		{ revalidate: 60 },
	);

	// 데이터 슬라이싱 (10개만)
	const recentUsers = Array.isArray(users) ? users.slice(0, 10) : [];

	return (
		<p>
			<code>{JSON.stringify(recentUsers || [], null, 2)}</code>
		</p>
	);
}`}
							>
								<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base h-40 overflow-y-auto">
									<code>{JSON.stringify(recentUsers || [], null, 2)}</code>
								</p>
							</RunCodeblock>
							<div className="flex flex-col gap-2 pt-6">
								<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
									가져온 결과 데이터를 이용하여 리스트로 렌더링합니다.
								</p>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								{recentUsers.map((user) => (
									<Card
										key={user.id}
										className="flex flex-col"
									>
										<CardHeader>
											<CardTitle className="text-lg leading-tight">
												<span className="text-muted-foreground mr-2">#{user.id}</span>
												{user.name}
											</CardTitle>
										</CardHeader>
										<CardContent className="flex-1">
											<p className="text-sm text-muted-foreground">{user.email}</p>
										</CardContent>
									</Card>
								))}
							</div>

							{recentUsers.length === 0 && (
								<div className="text-center py-10 text-muted-foreground">데이터를 불러오지 못했습니다.</div>
							)}
						</div>
						{/* example 블럭요서 END */}
					</div>
				</div>
			</div>
		</>
	);
};

ServerApiServerComponentExPage.displayName = 'ServerApiServerComponentExPage';
export default ServerApiServerComponentExPage;
