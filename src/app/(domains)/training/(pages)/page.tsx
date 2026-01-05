'use client';

import type { IComponent } from '@/core/types/common';
import { Separator } from '@/core/components/shadcn/ui/separator';
import RunCodeblock from '@/app/(domains)/training/_components/RunCodeblock';

interface ITrainingMainProps {
	test?: string;
}

const TrainingMain: IComponent<ITrainingMainProps> = () => {
	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								페이지 및 레이아웃 만들기
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							페이지 만들기 첫 실습입니다.
						</p>
					</div>
					<div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
						<Separator className="my-6" />
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl mb-2"
								>
									페이지 기본 템플릿
								</h2>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								모든 페이지(<strong>page.tsx</strong>)는 다음과 같은 기본 템플릿을 복사하여 생성합니다.
							</p>
							<div className="flex justify-center py-1">
								<RunCodeblock
									lineNumbers={false}
									showCodeBlockCopyButton={false}
									showCollapsed={false}
									rounded={false}
									codeTemplate={`// ========================================================
// 페이지 만들기 기본 템플릿
// ========================================================
 
// 페이지 컴포넌트의 기본 타입 가져오기
import type { IComponent } from '@/core/types/common';
 
// 페이지 컴포넌트의 Props 타입 정의
interface ISamplePageProps {
	// test?: string;
}
 
// 페이지 컴포넌트 본체
const SamplePage: IComponent<ISamplePageProps> = () => {
	return (<div>기본 템플릿 페이지입니다.</div>);
};
// 페이지 컴포넌트 이름 정의
SamplePage.displayName = 'SamplePage';
export default SamplePage;`}
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
// 페이지 컴포넌트 이름 정의
TrainingMain.displayName = 'TrainingMain';
export default TrainingMain;
