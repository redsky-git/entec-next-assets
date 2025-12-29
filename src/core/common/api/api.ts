import BaseAxiosClient from './base-axios-client';
import BaseFetchClient from './base-fetch-client';
import { ApiRequestConfig, ApiResponse } from '@app-types/common/app-api-types';

export class ApiError extends Error {
	constructor(
		public status: number,
		public message: string,
		public data?: any,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

/**
 * 통합 API 호출 함수 - Client/Server 컴포넌트 모두 사용 가능
 *
 * 환경 자동 감지:
 * - Client 환경: clientAPI (axios) 사용
 * - Server 환경: fetch 사용
 * - apiCallType 옵션으로 강제 지정 가능
 *
 * @param endpoint - API 엔드포인트 경로
 * @param config - 요청 설정
 * @param nextConfig - Next.js fetch 옵션 (서버 사이드에서만 적용)(글로벌 타입(NextFetchRequestConfig), from next/types/global.d.ts)
 * @returns Promise<ApiResponse<T>>
 *
 * @example
 * // 자동 감지 (권장)
 * const { data } = await callApi('/api/users');
 *
 * // Client 강제 지정
 * const { data } = await callApi('/api/users', { apiCallType: 'client' });
 *
 * // Server 강제 지정 (캐싱 옵션 사용)
 * const { data } = await callApi('/api/posts',
 *   { apiCallType: 'server' },
 *   { revalidate: 3600, tags: ['posts'] }
 * );
 */
export async function callApi<T = any>(
	endpoint: string,
	config: ApiRequestConfig = {},
	nextConfig: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	// 1. 환경 감지
	const isClient = typeof window !== 'undefined';
	const apiCallType = config.apiCallType || 'server'; //(isClient ? 'client' : 'server');

	console.log('[callApi] 호출:', { endpoint, apiCallType, isClient });

	// 2. Client 환경 - clientAPI 사용
	if (apiCallType === 'client') {
		console.log('[callApi] Client 환경 - axios 사용');
		try {
			const reqConfig = BaseAxiosClient.makeRequestConfig(endpoint, config);

			// 토큰이 필요한 경우 로직
			const token = null;
			// 예: token = localStorage.getItem('access_token');

			const response = await BaseAxiosClient.request<T>(reqConfig, token);

			return {
				data: response.data as T,
				status: response.status || 200,
				message: (response.data as any)?.message,
			};
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError(500, error instanceof Error ? error.message : '알 수 없는 오류', error);
		}
	}

	// 3. Server 환경 - fetch 사용
	if (apiCallType === 'server') {
		console.log('[callApi] Server 환경 - fetch 사용');
		const reqConfig = BaseFetchClient.makeRequestConfig(endpoint, config, nextConfig);

		// 토큰이 필요한 경우 로직
		const token = null;
		// 예: token = localStorage.getItem('access_token');
		console.log('[callApi] reqConfig:::', reqConfig);
		const response = await BaseFetchClient.request<T>(reqConfig, token);
		return {
			data: response.data as T,
			status: response.status || 200,
			message: (response.data as any)?.message,
		};
	}

	// 4. 예상치 못한 apiCallType
	throw new ApiError(500, `Invalid apiCallType: ${apiCallType}`);
}
