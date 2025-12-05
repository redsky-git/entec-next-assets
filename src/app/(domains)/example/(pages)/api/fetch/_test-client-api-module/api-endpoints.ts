// API 엔드포인트 상수 관리
export const API_ENDPOINTS = {
	// User 관련
	USER: {
		GET_PROFILE: '/api/user/profile',
		UPDATE_PROFILE: '/api/user/profile',
		GET_LIST: '/api/user/list',
	},

	// Auth 관련
	AUTH: {
		LOGIN: '/api/auth/login',
		LOGOUT: '/api/auth/logout',
		REGISTER: '/api/auth/register',
		REFRESH: '/api/auth/refresh',
	},

	// Post 관련
	POST: {
		GET_LIST: '/api/post/list',
		GET_DETAIL: (id: string | number) => `/api/post/${id}`,
		CREATE: '/api/post',
		UPDATE: (id: string | number) => `/api/post/${id}`,
		DELETE: (id: string | number) => `/api/post/${id}`,
	},

	// 예시: 동적 엔드포인트 생성 헬퍼
	createEndpoint: (base: string, params?: Record<string, any>) => {
		let endpoint = base;
		if (params) {
			const queryString = new URLSearchParams(params).toString();
			endpoint += `?${queryString}`;
		}
		return endpoint;
	},
} as const;
