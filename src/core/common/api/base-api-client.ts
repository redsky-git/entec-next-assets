import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiInstanceConfig, CommonRequestInterceptorsConfig, ApiResponse } from '@app-types/common';

// BaseApiClient 클래스는 Client, Server 모두 사용할 수 있는 기본 API 클라이언트 클래스이다.
export class BaseApiClient {
	// axiosInstance를 생성하여 request를 보낼 수 있도록 한다.
	protected axiosInstance: AxiosInstance;

	// BaseApiClient 클래스 생성자
	constructor(config: ApiInstanceConfig = {}) {
		// axiosInstance를 생성
		this.axiosInstance = this.#createAxiosInstance(config);
		// axiosInstance의 기본값 설정. 도메인이 다른 API를 호출할 때 CORS 문제로 쿠키를 전달해야 하는 경우 사용합니다.
		// false 이면 쿠키 전송 비활성화: cross-site 요청에 쿠키가 자동으로 포함되지 않음
		this.axiosInstance.defaults.withCredentials = true; // 쿠키 전송 설정
		// api request interceptor (API호출하기 전에 호출하는 인터셉터)
		this.axiosInstance.interceptors.request.use(this.#requestInterceptor);
		// api response interceptor (API호출 후에 호출 하는 인터셉터)
		// api error interceptor (API호출 중 에러 발생 시 호출 하는 인터셉터)
		this.axiosInstance.interceptors.response.use(this.#responseInterceptor, this.#errorInterceptor);
	}

	// axios 공통 config (기본 commonRequestConfig 설정) -> request 시 기본적으로 설정되는 config
	// '#' 기호를 사용하여 private 속성으로 선언(최신JS문법: private 속성 선언 방법)
	#commonRequestConfig: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json', // request 시 header에 Content-Type 추가
			Accept: 'application/json', // request 시 header에 Accept 추가
		},
		timeout: 30000, // request 시간 초과 시간 설정
	};

	// 기본 commonRequestConfig와 전달된 config를 병합하여 최종 config를 생성한 후, axiosInstance를 생성하는 private 메서드
	#createAxiosInstance(config: ApiInstanceConfig): AxiosInstance {
		// 기본 commonRequestConfig와 전달된 config를 병합하여 최종 config를 생성한 후, axiosInstance를 생성한다.
		return axios.create({
			...this.#commonRequestConfig,
			...config,
			baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || '', // baseURL값을 설정하면, request 시 baseURL 값이 자동으로 추가된다.
			timeout: config.timeout || 30000, // request 시간 초과 시간 설정
			headers: {
				...this.#commonRequestConfig.headers, // 기본 commonRequestConfig의 header 값 추가
				...(config.headers || {}), // 전달된 config의 header 값 추가
			},
		});
	}

	// api request interceptor (API호출하기 전에 호출하는 인터셉터)
	#requestInterceptor(
		requestConfig: CommonRequestInterceptorsConfig,
	): CommonRequestInterceptorsConfig | Promise<CommonRequestInterceptorsConfig> {
		console.log(`[AXIOS] (base-api-client) request interceptor`, requestConfig);
		return requestConfig;
	}

	// api response interceptor (API호출 후에 호출 하는 인터셉터)
	#responseInterceptor(response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> {
		console.log(`[AXIOS] (base-api-client) response interceptor`, response);
		return Promise.resolve(response);
	}

	// api error interceptor (API호출 중 에러 발생 시 호출 하는 인터셉터)
	#errorInterceptor(error: AxiosError): Promise<never> {
		return Promise.reject(error);
	}

	/**
	 * API 요청을 실행하는 메서드
	 * @param config - AxiosRequestConfig
	 * @param token - 토큰
	 * @returns ApiResponse<T>
	 */
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
