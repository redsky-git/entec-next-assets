import { serverApi } from '@/core/common/api/server-api';
import { Card, CardContent, CardHeader, CardTitle } from '@components/shadcn/ui/card';
import { Separator } from '@components/shadcn/ui/separator';

interface IPost {
	userId: number;
	id: number;
	title: string;
	body: string;
}

/**
 * Server Component Example
 * serverApi를 사용하여 서버 사이드에서 데이터를 fetching하고 렌더링합니다.
 */
export default async function ServerApiServerComponentExPage() {
	// serverApi 호출 (Server Component이므로 async/await 직접 사용 가능)
	// 캐싱 옵션: 60초 동안 캐시 유지 (ISR)
	const { data: posts } = await serverApi<IPost[]>(
		'https://jsonplaceholder.typicode.com/posts',
		{ method: 'GET' },
		{ revalidate: 60 },
	);

	// 데이터 슬라이싱 (10개만)
	const recentPosts = Array.isArray(posts) ? posts.slice(0, 10) : [];

	return (
		<div className="flex min-w-0 flex-1 flex-col">
			<div className="h-(--top-spacing) shrink-0" />
			<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
				<div className="flex flex-col gap-2">
					<div className="flex items-start justify-between">
						<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
							serverApi (Server Component)
						</h1>
					</div>
					<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
						이 페이지는 <strong>Server Component</strong>로 구현되었습니다.
						<br />
						<strong>serverApi</strong>를 사용하여 서버에서 직접 데이터를 가져와 렌더링합니다. (브라우저 네트워크 탭에서
						API 호출이 보이지 않습니다)
					</p>
				</div>

				<Separator className="my-6" />

				<div className="grid gap-4 md:grid-cols-2">
					{recentPosts.map((post) => (
						<Card
							key={post.id}
							className="flex flex-col"
						>
							<CardHeader>
								<CardTitle className="text-lg leading-tight">
									<span className="text-muted-foreground mr-2">#{post.id}</span>
									{post.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-sm text-muted-foreground">{post.body}</p>
							</CardContent>
						</Card>
					))}
				</div>

				{recentPosts.length === 0 && (
					<div className="text-center py-10 text-muted-foreground">데이터를 불러오지 못했습니다.</div>
				)}
			</div>
		</div>
	);
}
