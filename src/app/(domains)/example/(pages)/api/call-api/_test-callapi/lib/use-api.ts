// ============================================================================
// 6. lib/hooks/use-api.ts - React Query 커스텀 훅
// ============================================================================
'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { clientApi } from './client-api';
import type { ApiConfig } from './types';

/**
GET 요청용 커스텀 훅
*/
export function useApiQuery<T = any>(
	queryKey: readonly unknown[],
	config: ApiConfig,
	options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>,
) {
	return useQuery({
		queryKey,
		queryFn: () => clientApi(config),
		...options,
	});
}

/**
POST/PUT/DELETE 요청용 커스텀 훅
*/
export function useApiMutation<TData = any, TVariables = any>(
	config: Omit<ApiConfig, 'data'>,
	options?: UseMutationOptions<TData, Error, TVariables>,
) {
	const queryClient = useQueryClient();
	return useMutation<TData, Error, TVariables>({
		mutationFn: (variables: TVariables) => clientApi({ ...config, data: variables }),
		onSuccess: (data, variables, context, error) => {
			// 기본적으로 모든 쿼리 무효화 (필요시 커스터마이징)
			queryClient.invalidateQueries();
			options?.onSuccess?.(data, variables, context, error);
		},
		...options,
	});
}
