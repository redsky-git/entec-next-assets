'use client';

import { apiClient } from './client';
import type { ApiConfig } from './types';

/**

Client에서 사용하는 공통 API 호출 함수
*/
export async function clientApi<T = any>(config: ApiConfig): Promise<T> {
	try {
		const result = await apiClient.request(config);
		return result;
	} catch (error: any) {
		console.error('Client API Error:', error);
		throw new Error(error.response?.data?.message || 'API 호출 실패');
	}
}
