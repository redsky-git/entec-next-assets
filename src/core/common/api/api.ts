import { clientAPI } from './client-api-client';
import { ApiRequestConfig } from '@app-types/common/app-api-types';

export interface ApiResponse<T = any> {
	data: T;
	status: number;
	message?: string;
}

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
 * Next.js fetch 옵션 타입
 */
export interface NextFetchRequestConfig {
	revalidate?: number | false;
	tags?: string[];
}

// lib/api/config.ts
export const API_CONFIG = {
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
};

/**
 * 통합 API 호출 함수 - Client/Server 컴포넌트 모두 사용 가능
 * @param endpoint - API 엔드포인트 경로
 * @param config - 요청 설정
 * @param next - fetch 함수용 옵션 (next.js 15 이상 사용)
 * @returns Promise<ApiResponse<T>>
 */
//export async function callApi<T = any>(
//	endpoint: string,
//	config: ApiRequestConfig = {},
//	next: NextFetchRequestConfig = {}, // fetch 함수용 옵션 (next.js 15 이상 사용)
//): Promise<ApiResponse<T>> {
//	let response;
//	try {
//		console.log('callApi 호출 url:::::', endpoint);

//		const reqConfig = clientAPI.makeRequestConfig(endpoint, config);

//		// 토큰이 필요한 경우 로직 ========================================
//		const token = null;
//		//if (endpoint === '/auth/login') {
//		//	token = $util.getLocalStorage('access_token');
//		//}
//		// ==========================================================
//		response = await clientAPI.request<T>(reqConfig, token);

//		if (response.status !== 200) {
//			throw new ApiError(response.status as number, response.message || 'API 요청 실패', response.data);
//		}
//		return {
//			data: response.data as T,
//			status: response.status || 200,
//			message: (response.data as any)?.message,
//		};
//	} catch (error) {
//		if (error instanceof ApiError) {
//			throw error;
//		}
//		throw new ApiError(500, error instanceof Error ? error.message : '알 수 없는 오류', error);
//	}

//	return response.data as any;
//}

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
 * @param nextConfig - Next.js fetch 옵션 (서버 사이드에서만 적용)
 * @returns Promise<ApiResponse<T>>
 *
 * @example
 * // 자동 감지 (권장)
 * const { data } = await _callApi('/api/users');
 *
 * // Client 강제 지정
 * const { data } = await _callApi('/api/users', { apiCallType: 'client' });
 *
 * // Server 강제 지정 (캐싱 옵션 사용)
 * const { data } = await _callApi('/api/posts',
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

	console.log('[_callApi] 호출:', { endpoint, apiCallType, isClient });

	// 2. Client 환경 - clientAPI 사용
	if (apiCallType === 'client') {
		try {
			const reqConfig = clientAPI.makeRequestConfig(endpoint, config);

			// 토큰이 필요한 경우 로직
			const token = null;
			// 예: token = localStorage.getItem('access_token');

			const response = await clientAPI.request<T>(reqConfig, token);

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

	console.log('[callApi] Server 환경 - fetch 사용');
	// 3. Server 환경 - fetch 사용
	const { method = 'GET', headers = {}, body, params, cache } = config;

	// url 조합 (http url 또는 api base url 조합)===================
	let url: string;
	const isHttpUrl = /^https?:\/\//.test(endpoint);
	if (isHttpUrl) {
		url = endpoint;
	} else {
		url = `${API_CONFIG.baseURL}/${endpoint}`;
	}

	// Query parameters 추가
	if (params && Object.keys(params).length > 0) {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});
		const separator = url.includes('?') ? '&' : '?';
		url += `${separator}${searchParams.toString()}`;
	}

	// 요청 헤더 구성
	const requestHeaders: HeadersInit = {
		...API_CONFIG.headers,
		...headers,
	};

	try {
		// fetch 옵션 구성
		const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
			method,
			headers: requestHeaders,
			body: body ? JSON.stringify(body) : undefined,
		};

		// 캐시 옵션 추가
		if (cache) {
			fetchOptions.cache = cache;
		}

		// Next.js 캐싱 옵션 추가
		if (Object.keys(nextConfig).length > 0) {
			fetchOptions.next = nextConfig;
		}

		const response = await fetch(url, fetchOptions);
		const data = await response.json();

		if (!response.ok) {
			console.error('[_callApi] 에러:', {
				status: response.status,
				statusText: response.statusText,
				data,
			});
			throw new ApiError(response.status, data.message || data.error || response.statusText || 'API 요청 실패', data);
		}

		console.log('[_callApi] 성공:', { status: response.status });

		return {
			data,
			status: response.status,
			message: data.message,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		console.error('[_callApi] 예외 발생:', error);
		throw new ApiError(500, error instanceof Error ? error.message : '알 수 없는 오류', error);
	}
}

/**
 * 서버 사이드 전용 API 호출 함수 (fetch 기반)
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * @param endpoint - API 엔드포인트 경로
 * @param config - 요청 설정
 * @param nextConfig - Next.js fetch 옵션 (캐싱, 재검증 등)
 * @returns Promise<ApiResponse<T>>
 *
 * @example
 * // Server Component에서 사용
 * const { data } = await callServerApi('/api/users', { method: 'GET' });
 *
 * // Server Action에서 사용 (POST)
 * const result = await callServerApi('/api/users', {
 *   method: 'POST',
 *   body: { name: 'John' }
 * });
 *
 * // 캐싱 옵션 사용
 * const { data } = await callServerApi('/api/posts',
 *   { method: 'GET' },
 *   { revalidate: 3600, tags: ['posts'] }
 * );
 */
export async function callServerApi<T = any>(
	endpoint: string,
	config: ApiRequestConfig = {},
	nextConfig: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	const { method = 'GET', headers = {}, body, params } = config;

	// URL 생성
	let url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseURL}${endpoint}`;

	// Query parameters 추가
	if (params && Object.keys(params).length > 0) {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});
		url += `?${searchParams.toString()}`;
	}

	// 요청 헤더 구성
	const requestHeaders: HeadersInit = {
		...API_CONFIG.headers,
		...headers,
	};

	try {
		console.log('[callServerApi] 요청:', { url, method, body, nextConfig });

		// fetch 옵션 구성
		const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
			method,
			headers: requestHeaders,
			body: body ? JSON.stringify(body) : undefined,
		};

		// Next.js 캐싱 옵션 추가
		if (Object.keys(nextConfig).length > 0) {
			fetchOptions.next = nextConfig;
		}

		const response = await fetch(url, fetchOptions);
		const data = await response.json();

		if (!response.ok) {
			console.error('[callServerApi] 에러:', {
				status: response.status,
				statusText: response.statusText,
				data,
			});
			throw new ApiError(response.status, data.message || data.error || response.statusText || 'API 요청 실패', data);
		}

		console.log('[callServerApi] 성공:', { status: response.status, data });

		return {
			data,
			status: response.status,
			message: data.message,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		console.error('[callServerApi] 예외 발생:', error);
		throw new ApiError(500, error instanceof Error ? error.message : '알 수 없는 오류', error);
	}
}

/**
 * 서버 사이드 GET 요청 헬퍼 함수
 */
export async function serverGet<T = any>(
	endpoint: string,
	params?: ApiRequestConfig['params'],
	nextConfig?: NextFetchRequestConfig,
): Promise<ApiResponse<T>> {
	return callServerApi<T>(endpoint, { method: 'GET', params }, nextConfig);
}

/**
 * 서버 사이드 POST 요청 헬퍼 함수
 */
export async function serverPost<T = any>(
	endpoint: string,
	body?: any,
	nextConfig?: NextFetchRequestConfig,
): Promise<ApiResponse<T>> {
	return callServerApi<T>(endpoint, { method: 'POST', body }, nextConfig);
}

/**
 * 서버 사이드 PUT 요청 헬퍼 함수
 */
export async function serverPut<T = any>(
	endpoint: string,
	body?: any,
	nextConfig?: NextFetchRequestConfig,
): Promise<ApiResponse<T>> {
	return callServerApi<T>(endpoint, { method: 'PUT', body }, nextConfig);
}

/**
 * 서버 사이드 DELETE 요청 헬퍼 함수
 */
export async function serverDelete<T = any>(
	endpoint: string,
	params?: ApiRequestConfig['params'],
	nextConfig?: NextFetchRequestConfig,
): Promise<ApiResponse<T>> {
	return callServerApi<T>(endpoint, { method: 'DELETE', params }, nextConfig);
}

/**
 * 서버 사이드 PATCH 요청 헬퍼 함수
 */
export async function serverPatch<T = any>(
	endpoint: string,
	body?: any,
	nextConfig?: NextFetchRequestConfig,
): Promise<ApiResponse<T>> {
	return callServerApi<T>(endpoint, { method: 'PATCH', body }, nextConfig);
}
