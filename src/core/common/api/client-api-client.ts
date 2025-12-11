'use client';

import { BaseApiClient } from './base-api-client';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiInstanceConfig, CommonRequestInterceptorsConfig, ApiResponse } from '@app-types/common';
import type { ApiRequestConfig } from '@app-types/common/app-api-types';

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

	async request<T>(config: AxiosRequestConfig, token: string | null): Promise<ApiResponse<T>> {
		return this.executeRequest<T>(config, token);
	}

	// client api request config(axios request config) 생성
	makeRequestConfig(endpoint: string, config: ApiRequestConfig): AxiosRequestConfig {
		const { method = 'GET', params, headers = {}, body, cache } = config;

		// url 조합 (http url 또는 api base url 조합)===================
		let _url: URL;
		const isHttpUrl = /^https?:\/\//.test(endpoint);
		if (isHttpUrl) {
			_url = new URL(endpoint);
		} else {
			_url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`);
		}

		// GET 요청: query parameters 추가 =============================
		if (method.toUpperCase() === 'GET' && params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					_url.searchParams.append(key, String(value));
				}
			});
		}

		const _fetchOptions: AxiosRequestConfig = {
			method,
			url: _url.toString(),
			headers,
			timeout: config.timeout || 30000, // request 시간 초과 시간 설정
		};

		// POST, PUT, PATCH, DELETE 요청: body 추가
		if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase() as string) && body) {
			_fetchOptions['data'] = JSON.stringify(body);
		}

		return _fetchOptions;
	}
}

// ClientApiClient 싱글톤 인스턴스
export const clientAPI = new ClientApiClient();

export default ClientApiClient;
