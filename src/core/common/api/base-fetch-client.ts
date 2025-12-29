import type { ServerApiRequestConfig, ApiResponse, IBaseApiClient } from '@app-types/common';

/**
 * Fetch 기반 API 클라이언트 베이스 클래스(Client, Server 모두 사용 가능)
 *
 * Client, Server 환경에서 사용되는 fetch 기반의 HTTP 클라이언트입니다.
 */
export class BaseFetchClient implements IBaseApiClient {
	protected static instance: BaseFetchClient;
	protected baseURL: string;
	protected defaultTimeout: number;
	protected defaultHeaders: Record<string, string>;

	constructor(config: ServerApiRequestConfig = {}) {
		this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
		this.defaultTimeout = 30000;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		};

		// 전달된 config의 headers를 병합
		if (config.headers) {
			this.defaultHeaders = {
				...this.defaultHeaders,
				...config.headers,
			};
		}
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new BaseFetchClient();
		}
		return this.instance;
	}

	/**
	 * Fetch 요청을 실행하는 메서드
	 * @param config - Fetch 요청 설정
	 * @param token - 인증 토큰
	 * @returns Promise<ApiResponse<T>>
	 */
	protected async executeFetchRequest<T>(
		url: string,
		config: ServerApiRequestConfig,
		token: string | null,
	): Promise<ApiResponse<T>> {
		try {
			// 토큰이 있으면 헤더에 추가
			if (token) {
				config.headers = {
					...config.headers,
					Authorization: `Bearer ${token}`,
				};
			}

			const response = await fetch(url, config);

			// 응답이 JSON인지 확인
			const contentType = response.headers.get('content-type');
			const isJson = contentType?.includes('application/json');

			let data: any;
			if (isJson) {
				data = await response.json();
			} else {
				data = await response.text();
			}

			if (!response.ok) {
				return {
					success: false,
					error: data?.message || data?.error || response.statusText || 'API 요청 실패',
					statusCode: response.status,
					status: response.status,
				};
			}

			return {
				success: true,
				data: data as T,
				statusCode: response.status,
				status: response.status,
			};
		} catch (error) {
			// 네트워크 에러 또는 기타 예외 처리
			if (error instanceof TypeError && error.message.includes('fetch')) {
				return {
					success: false,
					error: '네트워크 연결 오류',
					statusCode: 0,
					status: 0,
				};
			}

			return {
				success: false,
				error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
				statusCode: 500,
				status: 500,
			};
		}
	}

	/**
	 * API 요청을 실행하는 메서드 (구현 필수)
	 */
	async request<T>(config: ServerApiRequestConfig & { url: string }, token: string | null): Promise<ApiResponse<T>> {
		const url = config.url;
		if (config.url) {
			delete (config as any).url;
		}
		return this.executeFetchRequest<T>(url, config, token);
	}

	/**
	 * API 요청 설정을 생성하는 메서드 (하위 클래스에서 구현)
	 */
	makeRequestConfig(
		endpoint: string,
		config: ServerApiRequestConfig,
		nextConfig: NextFetchRequestConfig = {},
	): ServerApiRequestConfig & { url: string } {
		const { method = 'GET', params, headers = {}, body, cache } = config;

		// url 조합 (http url 또는 api base url 조합)===================
		let _url: URL;
		const isHttpUrl = /^https?:\/\//.test(endpoint);
		const isRoutesPrefix = endpoint.startsWith('@routes');

		if (isHttpUrl) {
			_url = new URL(endpoint);
		} else if (isRoutesPrefix) {
			// @routes 접두사 제거 후 NEXT_PUBLIC_ROUTE_API_URL 사용
			const routeEndpoint = endpoint.replace(/^@routes\/?/, '');
			_url = new URL(`${process.env.NEXT_PUBLIC_ROUTE_API_URL}/${routeEndpoint}`);
		} else {
			_url = new URL(`${this.baseURL || ''}/${endpoint}`);
		}

		// GET 요청: query parameters 추가 =============================
		if (method.toUpperCase() === 'GET' && params && Object.keys(params).length > 0) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					_url.searchParams.append(key, String(value));
				}
			});
		}

		// 요청 헤더 구성
		const requestHeaders: Record<string, string> = { ...this.defaultHeaders };
		if (headers) {
			Object.entries(headers).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					requestHeaders[key] = String(value);
				}
			});
		}

		// fetch 옵션 구성
		const fetchOptions: ServerApiRequestConfig = {
			method,
			headers: requestHeaders,
		};

		// 캐시 옵션 추가
		if (cache) {
			fetchOptions.cache = cache;
		}

		// Next.js 캐싱 옵션 추가
		if (Object.keys(nextConfig).length > 0) {
			fetchOptions.next = nextConfig;
		}

		// POST, PUT, PATCH, DELETE 요청: body 추가
		if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase() as string) && body) {
			fetchOptions['body'] = JSON.stringify(body);
		}

		return { url: _url.toString(), ...fetchOptions };
	}
}

export default BaseFetchClient.getInstance();
