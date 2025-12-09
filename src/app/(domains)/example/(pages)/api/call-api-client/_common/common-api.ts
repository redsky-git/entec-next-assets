import { QueryParams } from './types';
import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { createQueryKey } from './queryKeyFactory';

// ============================================
// 범용 API 훅과 함께 사용
// ============================================

type THttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface IUseApiOptions<T> {
	/** HTTP Method (기본값: 'GET') */
	method?: THttpMethod;
	/** Query parameters (주로 GET 요청 시 사용) */
	params?: QueryParams;
	/** Request body (POST/PUT/PATCH/DELETE 요청 시 사용) */
	body?: Record<string, any>;
	/** Custom headers */
	headers?: Record<string, string>;
	/** React Query options */
	queryOptions?: UseQueryOptions<T>;
}

interface UseApiMutationOptions<TData, TVariables> {
	/** HTTP Method (기본값: 'POST') */
	method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	/** Custom headers */
	headers?: Record<string, string>;
	/** React Query mutation options */
	mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
}

/**
 * API 조회를 위한 범용 훅 (GET, POST 조회용)
 * @example
 * // GET 요청
 * const { data } = useApi<User>('users', { method: 'GET', params: { id: 1 } });
 *
 * // POST 요청 (body 전송)
 * const { data } = useApi<SearchResult>('search', {
 *   method: 'POST',
 *   body: { query: 'keyword', filters: ['tag1', 'tag2'] }
 * });
 *
 * // PUT 요청
 * const { data } = useApi<User>('users/1', {
 *   method: 'PUT',
 *   body: { name: 'John' }
 * });
 *
 * // DELETE 요청
 * const { data } = useApi<void>('users/1', { method: 'DELETE' });
 */
function useApi<T>(endpoint: string, options?: IUseApiOptions<T>) {
	const { method = 'GET', params, body, headers, queryOptions } = options || {};

	return useQuery({
		// queryKey: body가 있으면 body도 포함, params가 있으면 params 포함
		queryKey: createQueryKey(endpoint, body || params),
		queryFn: async () => {
			const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`);

			// GET 요청: query parameters 추가
			if (method === 'GET' && params) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						url.searchParams.append(key, String(value));
					}
				});
			}

			console.log(`[${method}] ${url.toString()}`);
			if (body) {
				console.log('Request Body:', body);
			}

			// fetch 옵션 설정
			const fetchOptions: RequestInit = {
				method,
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
			};

			// POST, PUT, PATCH, DELETE 요청: body 추가
			if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && body) {
				fetchOptions.body = JSON.stringify(body);
			}

			const response = await fetch(url.toString(), fetchOptions);
			if (!response.ok) {
				throw new Error(`API Error: ${response.status} ${response.statusText}`);
			}

			// 204 No Content 처리
			if (response.status === 204) {
				return null as T;
			}

			return response.json() as Promise<T>;
		},
		...queryOptions,
	});
}

/**
 * API 변경을 위한 범용 Mutation 훅 (POST, PUT, DELETE, PATCH)
 * 데이터 변경 작업에 최적화되어 있으며, onSuccess/onError 콜백 지원
 *
 * @example
 * // POST 요청
 * const createUser = useApiMutation<User, CreateUserInput>('users', { method: 'POST' });
 * createUser.mutate({ name: 'John', email: 'john@example.com' });
 *
 * // PUT 요청
 * const updateUser = useApiMutation<User, UpdateUserInput>('users/1', { method: 'PUT' });
 * updateUser.mutate({ name: 'Jane' });
 *
 * // DELETE 요청
 * const deleteUser = useApiMutation<void, void>('users/1', { method: 'DELETE' });
 * deleteUser.mutate();
 *
 * // 콜백 사용
 * const createPost = useApiMutation<Post, CreatePostInput>('posts', {
 *   method: 'POST',
 *   mutationOptions: {
 *     onSuccess: (data) => console.log('Created:', data),
 *     onError: (error) => console.error('Error:', error),
 *   }
 * });
 */
function useApiMutation<TData = unknown, TVariables = unknown>(
	endpoint: string,
	options?: UseApiMutationOptions<TData, TVariables>,
) {
	const { method = 'POST', headers, mutationOptions } = options || {};

	return useMutation<TData, Error, TVariables>({
		mutationFn: async (variables: TVariables) => {
			const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`);

			console.log(`[${method}] ${url.toString()}`);
			console.log('Request Body:', variables);

			const fetchOptions: RequestInit = {
				method,
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
			};

			// body가 있을 때만 추가
			if (variables !== undefined && variables !== null) {
				fetchOptions.body = JSON.stringify(variables);
			}

			const response = await fetch(url.toString(), fetchOptions);
			if (!response.ok) {
				throw new Error(`API Error: ${response.status} ${response.statusText}`);
			}

			// 204 No Content 처리
			if (response.status === 204) {
				return null as TData;
			}

			return response.json() as Promise<TData>;
		},
		...mutationOptions,
	});
}

export { useApi, useApiMutation };
export type { IUseApiOptions, UseApiMutationOptions, THttpMethod };
