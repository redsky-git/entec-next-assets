'use server';

import { cookies } from 'next/headers';
import { apiClient } from './client';
import type { ApiConfig } from './types';

/**
Server Action에서 사용하는 공통 API 호출 함수
*/
export async function serverApi<T = any>(config: ApiConfig): Promise<T> {
	try {
		// 쿠키에서 토큰 가져오기
		const cookieStore = await cookies();
		const token = cookieStore.get('accessToken')?.value;

		const result = await apiClient.requestFromServer<T>(config, token);
		return result;
	} catch (error: unknown) {
		console.error('Server API Error:', error);
		throw new Error((error as Error).message || 'API 호출 실패');
	}
}
