'use client';

import { createContext, useContext, useState } from 'react';
import type { IComponent } from '@/core/types/common';

export interface HeadingItem {
	id: string;
	text: string;
	level: 2 | 3;
}

interface ILayoutASideContext {
	headings: HeadingItem[];
	activeId: string | null;
	setHeadings: (headings: HeadingItem[]) => void;
	setActiveId: (id: string | null) => void;
}

const LayoutASideContext = createContext<ILayoutASideContext | undefined>(undefined);

interface ILayoutASideProviderProps {
	children: React.ReactNode;
}

const LayoutASideProvider: IComponent<ILayoutASideProviderProps> = ({ children }) => {
	const [headings, setHeadings] = useState<HeadingItem[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);

	return (
		<LayoutASideContext.Provider value={{ headings, activeId, setHeadings, setActiveId }}>
			{children}
		</LayoutASideContext.Provider>
	);
};

export const useLayoutASide = () => {
	const context = useContext(LayoutASideContext);
	if (context === undefined) {
		throw new Error('useLayoutASide는 LayoutASideProvider 내에서 사용해야 합니다.');
	}
	return context;
};

LayoutASideProvider.displayName = 'LayoutASideProvider';
export default LayoutASideProvider;
