import { QueryParams } from './types';
import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from './queryKeyFactory';

// ============================================
// 범용 API 훅과 함께 사용
// ============================================

function useApiQuery<T>(endpoint: string, params?: QueryParams) {
	return useQuery({
		queryKey: createQueryKey(endpoint, params),
		queryFn: async () => {
			const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`);
			if (params) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						url.searchParams.append(key, String(value));
					}
				});
			}
			const response = await fetch(url.toString());
			if (!response.ok) throw new Error('API Error');
			return response.json() as Promise<T>;
		},
		enabled: false,
	});
}

export { useApiQuery };
