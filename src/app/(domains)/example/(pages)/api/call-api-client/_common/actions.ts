'use server';

import { callServerApi } from '@fetch/api';
import { ApiRequestConfig } from '@app-types/common/app-api-types';

/**
 * 범용 Server Action - GET 요청
 * Client Component에서 호출 가능
 *
 * @example
 * const result = await serverActionGet('/api/v1/users', { id: 1 });
 */
export async function serverActionGet<T = any>(endpoint: string, params?: Record<string, any>) {
	try {
		const response = await callServerApi<T>(endpoint, {
			method: 'GET',
			params,
		});

		return {
			success: true,
			data: response.data,
			status: response.status,
		};
	} catch (error) {
		console.error('[serverActionGet] Error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : '알 수 없는 오류',
			data: null,
		};
	}
}

/**
 * 범용 Server Action - POST 요청
 *
 * @example
 * const result = await serverActionPost('/api/v1/users', { name: 'John' });
 */
export async function serverActionPost<T = any>(endpoint: string, body?: any) {
	try {
		const response = await callServerApi<T>(endpoint, {
			method: 'POST',
			body,
		});

		return {
			success: true,
			data: response.data,
			status: response.status,
		};
	} catch (error) {
		console.error('[serverActionPost] Error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : '알 수 없는 오류',
			data: null,
		};
	}
}

/**
 * 범용 Server Action - PUT 요청
 */
export async function serverActionPut<T = any>(endpoint: string, body?: any) {
	try {
		const response = await callServerApi<T>(endpoint, {
			method: 'PUT',
			body,
		});

		return {
			success: true,
			data: response.data,
			status: response.status,
		};
	} catch (error) {
		console.error('[serverActionPut] Error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : '알 수 없는 오류',
			data: null,
		};
	}
}

/**
 * 범용 Server Action - DELETE 요청
 */
export async function serverActionDelete<T = any>(endpoint: string, params?: Record<string, any>) {
	try {
		const response = await callServerApi<T>(endpoint, {
			method: 'DELETE',
			params,
		});

		return {
			success: true,
			data: response.data,
			status: response.status,
		};
	} catch (error) {
		console.error('[serverActionDelete] Error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : '알 수 없는 오류',
			data: null,
		};
	}
}

/**
 * 범용 Server Action - 커스텀 요청
 * 더 세밀한 제어가 필요한 경우 사용
 *
 * @example
 * const result = await serverActionRequest('/api/v1/search', {
 *   method: 'POST',
 *   body: { query: 'test' },
 *   headers: { 'X-Custom': 'value' }
 * });
 */
export async function serverActionRequest<T = any>(endpoint: string, config: ApiRequestConfig = {}) {
	try {
		const response = await callServerApi<T>(endpoint, config);

		return {
			success: true,
			data: response.data,
			status: response.status,
			message: response.message,
		};
	} catch (error) {
		console.error('[serverActionRequest] Error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : '알 수 없는 오류',
			data: null,
		};
	}
}
