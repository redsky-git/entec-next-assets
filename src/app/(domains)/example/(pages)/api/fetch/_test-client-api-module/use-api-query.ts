import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { clientAPI } from './client-api-client';
import type { ApiResponse, ApiRequestOptions } from '@app-types/common';

interface UseApiQueryOptions<TData> extends Omit<
	UseQueryOptions<ApiResponse<TData>, Error, TData>,
	'queryKey' | 'queryFn'
> {
	requestOptions?: ApiRequestOptions;
}

/**
 * API GET 요청을 위한 커스텀 useQuery 훅
 * @param queryKey - React Query 키
 * @param endpoint - API 엔드포인트
 * @param options - React Query 옵션 및 API 요청 옵션
 */
export function useApiQuery<TData = unknown>(
	queryKey: readonly unknown[],
	endpoint: string,
	options?: UseApiQueryOptions<TData>,
): UseQueryResult<TData, Error> {
	const { requestOptions, ...queryOptions } = options || {};

	return useQuery<ApiResponse<TData>, Error, TData>({
		queryKey,
		queryFn: async () => {
			const response = await clientAPI.get<TData>(endpoint, requestOptions);

			if (!response.success) {
				throw new Error(response.error || 'API 요청 실패');
			}

			return response;
		},
		select: (data) => data.data as TData, // ApiResponse에서 data만 추출
		...queryOptions,
	});
}

/**
 * 조건부로 API 요청을 수행하는 커스텀 훅
 */
export function useApiQueryConditional<TData = unknown>(
	queryKey: readonly unknown[],
	endpoint: string,
	enabled: boolean,
	options?: UseApiQueryOptions<TData>,
): UseQueryResult<TData, Error> {
	return useApiQuery<TData>(queryKey, endpoint, {
		...options,
		enabled,
	});
}
