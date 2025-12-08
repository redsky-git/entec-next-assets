import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiConfig } from './types';

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
			timeout: 30000,
			headers: { 'Content-Type': 'application/json' },
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request 인터셉터
		this.client.interceptors.request.use(
			(config) => {
				// 토큰이 있으면 헤더에 추가
				if (typeof window !== 'undefined') {
					const token = localStorage.getItem('accessToken');
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// Response 인터셉터
		this.client.interceptors.response.use(
			(response) => response.data,
			async (error) => {
				// 401 에러 처리 (토큰 만료)
				if (error.response?.status === 401) {
					// 토큰 갱신 로직 추가 가능
					if (typeof window !== 'undefined') {
						localStorage.removeItem('accessToken');
						window.location.href = '/login';
					}
				}
				return Promise.reject(error);
			},
		);
	}

	async request<T = any>(config: ApiConfig): Promise<T> {
		const axiosConfig: AxiosRequestConfig = {
			url: config.url,
			method: config.method || 'GET',
			params: config.params,
			data: config.data,
			headers: config.headers,
		};

		return this.client.request<any, T>(axiosConfig);
	}

	// 서버 사이드용 (토큰을 직접 전달)
	async requestFromServer<T = any>(config: ApiConfig, token?: string): Promise<T> {
		const axiosConfig: AxiosRequestConfig = {
			url: config.url,
			method: config.method || 'GET',
			params: config.params,
			data: config.data,
			headers: { ...config.headers, ...(token && { Authorization: `Bearer ${token}` }) },
		};

		return this.client.request<any, T>(axiosConfig);
	}
}

export const apiClient = new ApiClient();
