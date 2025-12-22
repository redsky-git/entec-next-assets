import type { IComponent } from '@app-types/common';
import type { JSX } from 'react';
import { Separator } from '@components/shadcn/ui/separator';
import RunCodeblock from '@domains/example/_components/example/RunCodeblock';

//import ServerApiForm from './_components/ServerApiForm';
import ServerForm from './_components/ServerForm';
import { cookies } from 'next/headers';

interface IServerApiFormDataExProps {
	test?: string;
}

/**
 * ServerApi FormData Example Page
 * serverApi를 사용하여 FormData를 전송하는 예제 페이지입니다.
 */
const ServerApiFormDataExPage: IComponent<IServerApiFormDataExProps> = async (): Promise<JSX.Element> => {
	const lastPostCookie = (await cookies()).get('lastPost');
	const postData = lastPostCookie ? JSON.parse(lastPostCookie.value) : null;
	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								serverApi (FormData 전송)
							</h1>
							<pre>{JSON.stringify(postData, null, 2)}</pre>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							이 페이지는 <strong>Server Component</strong>에서 <strong>serverApi</strong>를 통해{' '}
							<strong>FormData</strong>를 전송하는 예제입니다.
							<br />
							serverApi는 Server Action으로 동작하므로 브라우저에서 직접 API를 호출하지 않고, Next.js 서버를 거쳐 API를
							호출합니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							FormData는 Client Component에서 제출하여 사용할 수도있고, Server Component에서 제출하여 사용할 수도
							있습니다.
						</p>
						<ul className="list-disc list-inside text-sm space-y-1">
							<li>
								<strong>순수 Server Component : </strong>리다이렉트 + 쿠키 방식으로 마지막 결과를 저장하고 표시할 수
								있습니다.
							</li>
							<li>
								<strong>Client Component 방식 : </strong>가장 실용적이고, 페이지 새로고침없고, 로딩 상태와 결과를 동시에
								표시할 수 있습니다. 실제 프로젝트에서는 이 방식을 사용하는 것이 좋습니다.
							</li>
						</ul>
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
									FormData 전송 예제
								</h2>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								다음 예제는 <code className="bg-muted font-mono rounded px-1">https://koreanjson.com/posts</code>로
								게시글 데이터를 <strong>FormData</strong>로 전송합니다.
							</p>

							<div className="w-full flex-1 py-4">
								<h3 className="text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl mb-4">
									데이터 흐름(Server Component 방식)
								</h3>
								<RunCodeblock
									lineNumbers={false}
									showCodeBlockCopyButton={false}
									showCollapsed={false}
									rounded={false}
									codeTemplate={`
┌─────────────────────────────────────────────────────────────┐
│         Server Component (렌더링: Next.js Server)             │
│      (src/app/.../server-api-form-data-ex/page.tsx)         │
│                                                             │
│   HTML 생성 → <form action={submitForm}>                     │
│                                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │ (HTML 전달)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Browser (Client)                           │
│                                                             │
│   <form> 렌더링 및 사용자 입력                                   │
│   <button type="submit"> 클릭                                │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (FormData 직렬화 및 Server Action 호출)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          Server Action (Next.js Server)                     │
│         (actions.ts의 submitForm 함수)                        │
│                                                             │
│   export async function submitForm(formData: FormData) {    │
│       // FormData 수신 및 처리                                 │
│       const res = await serverApi(url, {                    │
│           method: 'POST',                                   │
│           body: formData                                    │
│       });                                                   │
│   }                │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          serverApi 함수 (Next.js Server)                     │
│         (src/core/common/api/server-api.ts)                 │
│                                                             │
│   fetch('https://koreanjson.com/posts', {                   │
│       method: 'POST',                                       │
│       body: FormData  // multipart/form-data 자동 설정        │
│   })                  │                                     │
└───────────────────────┼─────────────────────────────────────┘
                        │ (HTTP POST: multipart/form-data)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    External API                             │
│              (https://koreanjson.com/posts)                 │
└─────────────────────────────────────────────────────────────┘
`}
								/>
							</div>

							<div className="w-full flex-1 py-4">
								<h3 className="text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl mb-4">
									데이터 흐름(Client Component 방식)
								</h3>
								<RunCodeblock
									lineNumbers={false}
									showCodeBlockCopyButton={false}
									showCollapsed={false}
									rounded={false}
									codeTemplate={`
┌─────────────────────────────────────────────────────────────┐
│             Client Component (Browser)                      │
│      (src/app/.../server-api-form-data-ex)                  │
│                                                             │
│   <form action={invoke serverApi}>                          │
│         body: FormData                                      │
│                    │                                        │
│ └──────────────────┼────────────────────────────────────────┘
                     │ (Next.js Server Action 호출: 직렬화된 FormData 전달)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│             Server Action (Next.js Server)                  │
│               (src/core/common/api/server-api)              │
│                                                             │
│   fetch('https://koreanjson.com/posts', {                   │
│       method: 'POST',                                       │
│       body: FormData                                        │
│   })                                                        │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │ (multipart/form-data 전송)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    External API                             │
│              (https://koreanjson.com)                       │
└─────────────────────────────────────────────────────────────┘
`}
								/>
							</div>

							<div className="w-full flex-1 py-6">
								{/*<ServerApiForm />*/}
								<ServerForm />
							</div>

							<div className="w-full flex-1 py-4">
								<RunCodeblock
									title="구현 코드 예시"
									codeTemplate={`'use client';
import { serverApi } from '@fetch/server-api';

export default function PostForm() {
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        // serverApi 호출 (Server Action)
        // FormData를 body로 직접 전달
        const res = await serverApi(
            'https://koreanjson.com/posts', 
            {
                method: 'POST',
                body: formData 
            }
        );
        
        console.log(res.data);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="title" />
            <textarea name="content" />
            <button type="submit">전송</button>
        </form>
    );
}`}
								/>
							</div>
						</div>
						{/* example 블럭요서 END */}
					</div>
				</div>
			</div>
		</>
	);
};

ServerApiFormDataExPage.displayName = 'ServerApiFormDataExPage';
export default ServerApiFormDataExPage;
