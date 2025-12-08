import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

export interface ApiRequestConfig {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	cache?: RequestCache;
}

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
 * @returns Promise<ApiResponse<T>>
 */
export async function callApi<T = any>(
	endpoint: string,
	config: ApiRequestConfig = {},
	queryOption: UseQueryOptions | UseMutationOptions,
): Promise<ApiResponse<T>> {
	const { method = 'POST', headers = {}, body, cache } = config;

	const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseURL}${endpoint}`;

	const requestHeaders = {
		...API_CONFIG.headers,
		...headers,
	};

	try {
		// 추 후 이 부분에 makeRequestConfig 메서드를 추가하여 config를 생성하는 로직을 추가 예정.
		return this.executeRequest<T>(config, null);

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(response.status, data.message || 'API 요청 실패', data);
		}

		return {
			data,
			status: response.status,
			message: data.message,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError(500, error instanceof Error ? error.message : '알 수 없는 오류', error);
	}
}

/**
 * 통합 API 호출 함수 - Client/Server 컴포넌트 모두 사용 가능
 * @param endpoint - API 엔드포인트 경로
 * @param config - 요청 설정
 * @returns Promise<ApiResponse<T>>
 */
export async function _callApi<T = any>(
	endpoint: string,
	config: ApiRequestConfig = {},
	next: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	const { method = 'GET', headers = {}, body, cache } = config;

	const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseURL}${endpoint}`;

	const requestHeaders = {
		...API_CONFIG.headers,
		...headers,
	};

	try {
		const response = await fetch(url, {
			method,
			headers: requestHeaders,
			body: body ? JSON.stringify(body) : undefined,
			cache,
			next,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(response.status, data.message || 'API 요청 실패', data);
		}

		return {
			data,
			status: response.status,
			message: data.message,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError(500, error instanceof Error ? error.message : '알 수 없는 오류', error);
	}
}
