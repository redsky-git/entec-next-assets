'use server';

import { ApiRequestConfig } from '@app-types/common/app-api-types';

interface ApiResponse<T = any> {
	data: T;
	status: number;
	message?: string;
}

class ApiError extends Error {
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
const API_CONFIG = {
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
};
class ServerApiClient {
	static instance: ServerApiClient;

	// 싱글톤 인스턴스 반환
	static getInstance() {
		if (!this.instance) {
			this.instance = new ServerApiClient();
		}
		return this.instance;
	}

	async serverApi<T = any>(
		endpoint: string,
		config: ApiRequestConfig = {},
		nextConfig: NextFetchRequestConfig = {},
	): Promise<ApiResponse<T>> {
		const { method = 'GET', headers = {}, body, params } = config;

		// URL 생성
		// url 조합 (http url 또는 api base url 조합)===================
		//let url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseURL}${endpoint}`;
		let url: string = '';
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
}

export async function serverApi<T = any>(
	endpoint: string,
	config: ApiRequestConfig = {},
	nextConfig: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	return await ServerApiClient.getInstance().serverApi<T>(endpoint, config, nextConfig);
}
