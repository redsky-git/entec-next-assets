// ============================================
// 1. 타입 정의 (types/api.types.ts)
// ============================================

export type ApiResponse<T = any> = {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	statusCode?: number;
};

export type ApiConfig = {
	baseURL?: string;
	timeout?: number;
	headers?: Record<string, string>;
};

export type RequestOptions = {
	headers?: Record<string, string>;
	timeout?: number;
	// Next.js 특화 옵션 (서버에서만 사용)
	cache?: RequestCache;
	revalidate?: number | false;
	tags?: string[];
};

// ============================================
// 2. Base API Client (lib/base-api-client.ts)
// ============================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import type { ApiConfig, ApiResponse, RequestOptions } from '@/types/api.types';

export class BaseApiClient {
	protected axiosInstance: AxiosInstance;

	constructor(config: ApiConfig = {}) {
		this.axiosInstance = axios.create({
			baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || '',
			timeout: config.timeout || 30000,
			headers: {
				'Content-Type': 'application/json',
				...config.headers,
			},
		});
	}

	protected async executeRequest<T>(config: AxiosRequestConfig, token: string | null): Promise<ApiResponse<T>> {
		try {
			// 토큰이 있으면 헤더에 추가
			if (token) {
				config.headers = {
					...config.headers,
					Authorization: `Bearer ${token}`,
				};
			}

			const response = await this.axiosInstance.request<T>(config);

			return {
				success: true,
				data: response.data,
				statusCode: response.status,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<any>;

				if (axiosError.code === 'ECONNABORTED') {
					return {
						success: false,
						error: '요청 시간이 초과되었습니다',
						statusCode: 408,
					};
				}

				return {
					success: false,
					error:
						axiosError.response?.data?.message ||
						axiosError.response?.data?.error ||
						axiosError.message ||
						'API 요청 실패',
					statusCode: axiosError.response?.status || 500,
				};
			}

			return {
				success: false,
				error: '알 수 없는 오류가 발생했습니다',
				statusCode: 500,
			};
		}
	}
}

// ============================================
// 3. Client API Client (lib/client-api-client.ts)
// ============================================

('use client');

import { BaseApiClient } from './base-api-client';
import type { ApiConfig, ApiResponse, RequestOptions } from '@/types/api.types';
import type { AxiosRequestConfig } from 'axios';

class ClientApiClient extends BaseApiClient {
	constructor(config?: ApiConfig) {
		super(config);

		// 요청 인터셉터 - 모든 요청에 토큰 자동 추가
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = this.getAuthToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// 응답 인터셉터 - 401 에러 처리
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					// 토큰 만료 시 로그아웃 처리
					this.handleUnauthorized();
				}
				return Promise.reject(error);
			},
		);
	}

	private getAuthToken(): string | null {
		if (typeof document === 'undefined') return null;

		const cookies = document.cookie.split(';');
		const authCookie = cookies.find((c) => c.trim().startsWith('auth_token='));
		return authCookie ? authCookie.split('=')[1] : null;
	}

	private handleUnauthorized(): void {
		// 쿠키 삭제
		document.cookie = 'auth_token=; Max-Age=0; path=/;';
		// 로그인 페이지로 리다이렉트
		if (typeof window !== 'undefined') {
			window.location.href = '/login';
		}
	}

	async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: endpoint,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, null);
	}

	async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		const config: AxiosRequestConfig = {
			method: 'POST',
			url: endpoint,
			data: body,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, null);
	}

	async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		const config: AxiosRequestConfig = {
			method: 'PUT',
			url: endpoint,
			data: body,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, null);
	}

	async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		const config: AxiosRequestConfig = {
			method: 'PATCH',
			url: endpoint,
			data: body,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, null);
	}

	async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		const config: AxiosRequestConfig = {
			method: 'DELETE',
			url: endpoint,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, null);
	}
}

// Client 싱글톤 인스턴스
export const clientApi = new ClientApiClient();

// ============================================
// 4. Server API Client (lib/server-api-client.ts)
// ============================================

('use server');

import { cookies } from 'next/headers';
import { BaseApiClient } from './base-api-client';
import type { ApiConfig, ApiResponse, RequestOptions } from '@/types/api.types';
import type { AxiosRequestConfig } from 'axios';

class ServerApiClient extends BaseApiClient {
	constructor(config?: ApiConfig) {
		super(config);
	}

	private async getAuthToken(): Promise<string | null> {
		const cookieStore = await cookies();
		return cookieStore.get('auth_token')?.value || null;
	}

	async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		const token = await this.getAuthToken();
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: endpoint,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, token);
	}

	async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		const token = await this.getAuthToken();
		const config: AxiosRequestConfig = {
			method: 'POST',
			url: endpoint,
			data: body,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, token);
	}

	async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		const token = await this.getAuthToken();
		const config: AxiosRequestConfig = {
			method: 'PUT',
			url: endpoint,
			data: body,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, token);
	}

	async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		const token = await this.getAuthToken();
		const config: AxiosRequestConfig = {
			method: 'PATCH',
			url: endpoint,
			data: body,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, token);
	}

	async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		const token = await this.getAuthToken();
		const config: AxiosRequestConfig = {
			method: 'DELETE',
			url: endpoint,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		return this.executeRequest<T>(config, token);
	}
}

// Server 싱글톤 인스턴스
export const serverApi = new ServerApiClient();

// ============================================
// 5. 사용 예시 - Client Component
// ============================================

('use client');

import { useState } from 'react';
import { clientApi } from '@/lib/client-api-client';

export function TransferForm() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		const formData = new FormData(e.currentTarget);

		const result = await clientApi.post('/api/transfer', {
			fromAccountId: formData.get('from') as string,
			toAccountId: formData.get('to') as string,
			amount: Number(formData.get('amount')),
			memo: formData.get('memo') as string,
		});

		setLoading(false);

		if (result.success) {
			alert(`이체 완료! 거래번호: ${result.data?.transactionId}`);
		} else {
			setError(result.error || '이체 실패');
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4"
		>
			<div>
				<label>출금 계좌</label>
				<input
					name="from"
					required
					className="border p-2 w-full"
				/>
			</div>

			<div>
				<label>입금 계좌</label>
				<input
					name="to"
					required
					className="border p-2 w-full"
				/>
			</div>

			<div>
				<label>금액</label>
				<input
					name="amount"
					type="number"
					required
					className="border p-2 w-full"
				/>
			</div>

			{error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

			<button
				type="submit"
				disabled={loading}
				className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
			>
				{loading ? '처리 중...' : '이체하기'}
			</button>
		</form>
	);
}

// ============================================
// 6. 사용 예시 - Server Component
// ============================================

import { serverApi } from '@/lib/server-api-client';

type Account = {
	id: string;
	accountNumber: string;
	accountName: string;
	balance: number;
};

export default async function AccountsPage() {
	const result = await serverApi.get<{ accounts: Account[] }>('/api/accounts');

	if (!result.success) {
		return <div>에러: {result.error}</div>;
	}

	return (
		<div>
			<h1>내 계좌</h1>
			<ul>
				{result.data?.accounts.map((account) => (
					<li key={account.id}>
						{account.accountName} - {account.balance.toLocaleString()}원
					</li>
				))}
			</ul>
		</div>
	);
}

// ============================================
// 7. 사용 예시 - Server Actions
// ============================================

('use server');

import { serverApi } from '@/lib/server-api-client';
import { revalidateTag } from 'next/cache';

type TransferInput = {
	fromAccountId: string;
	toAccountId: string;
	amount: number;
	memo?: string;
};

export async function transferMoney(data: TransferInput) {
	const result = await serverApi.post('/api/transfer', data);

	if (result.success) {
		revalidateTag('accounts');
		revalidateTag('transactions');
	}

	return result;
}

export async function getAccountDetail(accountId: string) {
	return serverApi.get(`/api/accounts/${accountId}`);
}

export async function updateCustomer(customerId: string, data: any) {
	const result = await serverApi.patch(`/api/customers/${customerId}`, data);

	if (result.success) {
		revalidateTag('customers');
	}

	return result;
}

// ============================================
// 8. 환경 변수 (.env.local)
// ============================================

/*
# Client/Server 모두 접근 가능
NEXT_PUBLIC_API_BASE_URL=https://api.yourbank.com

# Server only
API_SECRET_KEY=your-secret-key
*/

// ============================================
// 9. package.json 의존성
// ============================================

/*
{
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
*/
