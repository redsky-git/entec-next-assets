'use client';

import type { IComponent } from '@/core/types/common';
import type { JSX } from 'react';

import UICodeBlockEx from '@/shared/components/common/ui/UICodeBlockEx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/shadcn/ui/tabs';

interface IRunCodeblockProps {
	children?: any;
	codeTemplate?: string;
	title?: string;
}

const RunCodeblock: IComponent<IRunCodeblockProps> = ({ children, codeTemplate = '', title = '' }): JSX.Element => {
	return (
		<Tabs defaultValue="preview">
			<TabsList
				className="bg-transparent p-0 h-auto rounded-none shadow-none"
				style={{ height: title.length === 0 ? '0' : `${title.length * 0.03}rem` }}
			>
				<TabsTrigger
					value="preview"
					className="text-lg font-semibold text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 px-1 shadow-none"
				>
					{title}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="preview">
				<div className="grid">
					<div className="w-full min-w-0">{children}</div>
					<div className="w-full min-w-0 overflow-x-auto">
						<UICodeBlockEx
							showHeader={false}
							language="tsx"
							filename="SamplePage.tsx"
							className="rounded-t-none rounded-b-md"
						>
							{codeTemplate || ''}
						</UICodeBlockEx>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
};

RunCodeblock.displayName = 'RunCodeblock';
export default RunCodeblock;
