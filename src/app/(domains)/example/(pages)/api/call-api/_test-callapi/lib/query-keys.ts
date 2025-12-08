// ============================================================================
// 7. lib/hooks/query-keys.ts - React Query Key 관리 팩토리
// ============================================================================
/**
React Query Key 관리 팩토리
*/
export const queryKeys = {
	// User 도메인
	user: {
		all: ['user'] as const,
		lists: () => [...queryKeys.user.all, 'list'] as const,
		list: (filters: any) => [...queryKeys.user.lists(), filters] as const,
		details: () => [...queryKeys.user.all, 'detail'] as const,
		detail: (id: string | number) => [...queryKeys.user.details(), id] as const,
	},
	// Product 도메인
	product: {
		all: ['product'] as const,
		lists: () => [...queryKeys.product.all, 'list'] as const,
		list: (filters: any) => [...queryKeys.product.lists(), filters] as const,
		details: () => [...queryKeys.product.all, 'detail'] as const,
		detail: (id: string | number) => [...queryKeys.product.details(), id] as const,
	},
	// 도메인별로 확장 가능
	// order: { ... }, // payment: { ... },
};
