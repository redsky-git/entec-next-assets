'use client';

import type { IComponent } from '@/core/types/common';
import { useEffect, useState, type JSX } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import type { BundledLanguage } from '@/core/components/shadcn-io/ui/code-block';
import {
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockFiles,
	CodeBlockHeader,
	CodeBlockItem,
	CodeBlockSelect,
	CodeBlockSelectContent,
	CodeBlockSelectItem,
	CodeBlockSelectTrigger,
	CodeBlockSelectValue,
} from '@/core/components/shadcn-io/ui/code-block';

type TCode = { language: string; filename: string; code: string }[];
interface IUICodeBlockExProps {
	children: string;
	language: string;
	filename?: string;
	code?: TCode;
	showHeader?: boolean; // 헤더 표시 여부 (기본값: true)
	themes?: {
		light: string;
		dark: string;
	}; // 코드 하이라이팅 테마 (기본값: vitesse-light/dark)
	forceDarkTheme?: boolean; // 항상 다크 테마 배경 사용 (기본값: false)
	className?: string;
	lineNumbers?: boolean; // 코드 라인 번호 표시 여부 (기본값: false)
	showCodeBlockCopyButton?: boolean;
	showCollapsed?: boolean;
}

const UICodeBlockEx: IComponent<IUICodeBlockExProps> = ({
	children,
	language,
	filename = '',
	code = [{ language: '', filename: '', code: '' }],
	showHeader = true,
	themes = {
		light: 'github-light',
		dark: 'github-dark',
	},
	forceDarkTheme = false,
	className = '',
	lineNumbers = true,
	showCodeBlockCopyButton = true,
	showCollapsed = true,
}): JSX.Element => {
	const [codeData, setCodeData] = useState<TCode>([{ language, filename: '', code: '' }]);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const createCodeData = () => {
		if (!children && code) {
			setCodeData(code);
		} else {
			setCodeData([
				{
					language: language ?? '',
					filename: filename ?? '',
					code: children ?? '',
				},
			]);
		}
	};

	useEffect(() => {
		createCodeData();
	}, []);

	return (
		<div className="w-full max-w-full min-w-0 relative">
			<CodeBlock
				data={codeData}
				defaultValue={language}
				className={forceDarkTheme ? `dark bg-[#0d1117] ${className}` : className}
			>
				{showHeader ? (
					<CodeBlockHeader className={forceDarkTheme ? 'bg-[#161b22] border-[#30363d]' : ''}>
						<CodeBlockFiles>
							{(item) => (
								<CodeBlockFilename
									key={item.language}
									value={item.language}
								>
									{item.filename}
								</CodeBlockFilename>
							)}
						</CodeBlockFiles>
						<CodeBlockSelect>
							<CodeBlockSelectTrigger>
								<CodeBlockSelectValue />
							</CodeBlockSelectTrigger>
							<CodeBlockSelectContent>
								{(item) => (
									<CodeBlockSelectItem
										key={item.language}
										value={item.language}
									>
										{item.language}
									</CodeBlockSelectItem>
								)}
							</CodeBlockSelectContent>
						</CodeBlockSelect>
						<CodeBlockCopyButton
							onCopy={() => console.log('Copied code to clipboard')}
							onError={() => console.error('Failed to copy code to clipboard')}
						/>
					</CodeBlockHeader>
				) : (
					<div className="absolute top-2 right-2 z-10 flex items-center gap-2">
						{showCollapsed && (
							<button
								onClick={() => setIsCollapsed(!isCollapsed)}
								className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
								aria-label={isCollapsed ? '코드 펼치기' : '코드 접기'}
							>
								{isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
							</button>
						)}
						{showCodeBlockCopyButton && (
							<CodeBlockCopyButton
								onCopy={() => console.log('Copied code to clipboard')}
								onError={() => console.error('Failed to copy code to clipboard')}
							/>
						)}
					</div>
				)}
				{!isCollapsed ? (
					<CodeBlockBody>
						{(item) => (
							<CodeBlockItem
								key={item.language}
								value={item.language}
								lineNumbers={lineNumbers}
							>
								<CodeBlockContent
									language={item.language as BundledLanguage}
									themes={themes}
									className={forceDarkTheme ? 'dark bg-[#0d1117]' : 'bg-[#f6f6f6]'}
								>
									{children}
								</CodeBlockContent>
							</CodeBlockItem>
						)}
					</CodeBlockBody>
				) : (
					<div className="h-12" />
				)}
			</CodeBlock>
		</div>
	);
};

UICodeBlockEx.displayName = 'UICodeBlockEx';
export default UICodeBlockEx;
