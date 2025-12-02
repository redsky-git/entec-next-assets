'use client';

import type { IComponent } from '@/core/types/common';
import { useEffect, useState, type JSX } from 'react';

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
interface IUICodeBlockProps {
	children: string;
	language: string;
	filename?: string;
	code?: TCode;
}

const UICodeBlock: IComponent<IUICodeBlockProps> = ({
	children,
	language,
	filename = '',
	code = [{ language: '', filename: '', code: '' }],
}): JSX.Element => {
	const [codeData, setCodeData] = useState<TCode>([{ language, filename: '', code: '' }]);

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
		<CodeBlock
			data={codeData}
			defaultValue={language}
		>
			<CodeBlockHeader>
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
			<CodeBlockBody>
				{(item) => (
					<CodeBlockItem
						key={item.language}
						value={item.language}
					>
						<CodeBlockContent language={item.language as BundledLanguage}>{children}</CodeBlockContent>
					</CodeBlockItem>
				)}
			</CodeBlockBody>
		</CodeBlock>
	);
};

UICodeBlock.displayName = 'UICodeBlock';
export default UICodeBlock;
