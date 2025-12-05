'use client';

import { BaseApiClient } from './base-api-client';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type {
	ApiInstanceConfig,
	CommonRequestInterceptorsConfig,
	ApiRequestOptions,
	ApiResponse,
} from '@app-types/common';

class ClientApiClient extends BaseApiClient {
	constructor(config?: ApiInstanceConfig) {
		// super(config)는 부모 클래스(BaseApiClient)의 생성자를 호출하여
		// axios 인스턴스를 포함한 공통 API 클라이언트 초기화 로직을 수행합니다.
		// 이렇게 하면 ClientApiClient에서도 부모의 초기화 및 기능을 그대로 사용할 수 있습니다.
		super(config);
		// api request interceptor (API호출하기 전에 호출하는 인터셉터)
		this.axiosInstance.interceptors.request.use(this.#requestInterceptor);
		// api response interceptor (API호출 후에 호출 하는 인터셉터)
		// api error interceptor (API호출 중 에러 발생 시 호출 하는 인터셉터)
		this.axiosInstance.interceptors.response.use(this.#responseInterceptor, this.#errorInterceptor);
	}

	// api request interceptor (API호출하기 전에 호출하는 인터셉터)
	#requestInterceptor(
		requestConfig: CommonRequestInterceptorsConfig,
	): CommonRequestInterceptorsConfig | Promise<CommonRequestInterceptorsConfig> {
		console.log(`[AXIOS] (client-api-client) request interceptor`, requestConfig);
		return requestConfig;
	}

	// api response interceptor (API호출 후에 호출 하는 인터셉터)
	#responseInterceptor(response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> {
		console.log(`[AXIOS] (client-api-client) response interceptor`, response);
		return Promise.resolve(response);
	}

	// api error interceptor (API호출 중 에러 발생 시 호출 하는 인터셉터)
	#errorInterceptor(error: AxiosError): Promise<never> {
		console.log(`[AXIOS] (client-api-client) error interceptor`, error);
		return Promise.reject(error);
	}

	async get<T>(apiEndpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: apiEndpoint,
			headers: options?.headers,
			timeout: options?.timeout,
		};

		// 추 후 이 부분에 makeRequestConfig 메서드를 추가하여 config를 생성하는 로직을 추가 예정.

		return this.executeRequest<T>(config, null);
	}

	//async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
	//	const config: AxiosRequestConfig = {
	//		method: 'POST',
	//		url: endpoint,
	//		data: body,
	//		headers: options?.headers,
	//		timeout: options?.timeout,
	//	};

	//	return this.executeRequest<T>(config, null);
	//}

	//async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
	//	const config: AxiosRequestConfig = {
	//		method: 'PUT',
	//		url: endpoint,
	//		data: body,
	//		headers: options?.headers,
	//		timeout: options?.timeout,
	//	};

	//	return this.executeRequest<T>(config, null);
	//}

	//async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
	//	const config: AxiosRequestConfig = {
	//		method: 'PATCH',
	//		url: endpoint,
	//		data: body,
	//		headers: options?.headers,
	//		timeout: options?.timeout,
	//	};

	//	return this.executeRequest<T>(config, null);
	//}

	//async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
	//	const config: AxiosRequestConfig = {
	//		method: 'DELETE',
	//		url: endpoint,
	//		headers: options?.headers,
	//		timeout: options?.timeout,
	//	};

	//	return this.executeRequest<T>(config, null);
	//}
}

// ClientApiClient 싱글톤 인스턴스
export const clientApi = new ClientApiClient();

export default ClientApiClient;
