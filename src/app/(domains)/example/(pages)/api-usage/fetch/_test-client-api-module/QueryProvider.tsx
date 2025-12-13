'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from './query-client-config';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
	children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
	// useState로 QueryClient를 초기화하여 React 생명주기와 동기화
	const [queryClient] = useState(() => getQueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
}
