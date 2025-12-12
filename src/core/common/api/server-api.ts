'use server';

import { ServerApiRequestConfig, ApiResponse } from '@app-types/common/app-api-types';
import { callApi } from '@fetch/api';

/**
 * Server API 호출 비동기 함수
 *
 * Server Component나 Server Action에서 사용되는 API 호출 함수입니다.
 * callApi 함수의 apiCallType: 'server'를 이용하여 fetch 기반의 API 호출을 수행합니다.
 *
 * @param endpoint - api url의 마지막 부분 또는 http로 시작하는 전체 url
 * @param config - server 호출용 api config
 * @param nextConfig - Next.js fetch 옵션 (서버 사이드에서만 적용)(글로벌 타입(NextFetchRequestConfig), from next/types/global.d.ts)
 * @returns Promise<ApiResponse<T>>
 *
 * @example
 * // api url의 마지막 부분 또는 http로 시작하는 전체 url 사용
 * const { data } = await serverApi('/api/users');
 *
 * // Next.js fetch 옵션 사용
 * const { data } = await serverApi('/api/posts',
 *   { method: 'GET' },
 *   { revalidate: 3600, tags: ['posts'] }
 * );
 */
export async function serverApi<T = any>(
	endpoint: string,
	config: ServerApiRequestConfig = {},
	nextConfig: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	const response = await callApi<T>(endpoint, { ...config, apiCallType: 'server' }, nextConfig);
	return response;
}
