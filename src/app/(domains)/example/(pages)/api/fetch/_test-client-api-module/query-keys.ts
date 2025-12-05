// React Query Key 관리 (타입 안전성 보장)
export const queryKeys = {
	// User 관련 키
	user: {
		all: ['user'] as const,
		profile: () => [...queryKeys.user.all, 'profile'] as const,
		list: (filters?: Record<string, any>) => [...queryKeys.user.all, 'list', filters] as const,
		detail: (id: string | number) => [...queryKeys.user.all, 'detail', id] as const,
	},

	// Post 관련 키
	post: {
		all: ['post'] as const,
		lists: () => [...queryKeys.post.all, 'list'] as const,
		list: (filters?: Record<string, any>) => [...queryKeys.post.lists(), filters] as const,
		details: () => [...queryKeys.post.all, 'detail'] as const,
		detail: (id: string | number) => [...queryKeys.post.details(), id] as const,
	},

	// Auth 관련 키
	auth: {
		all: ['auth'] as const,
		session: () => [...queryKeys.auth.all, 'session'] as const,
	},
} as const;

// 사용 예시:
// queryKeys.user.profile() => ['user', 'profile']
// queryKeys.post.detail(1) => ['post', 'detail', 1]
// queryKeys.post.list({ page: 1 }) => ['post', 'list', { page: 1 }]
