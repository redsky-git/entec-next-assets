import { useState } from 'react';
import { useQuery, UseQueryResult, useMutation } from '@tanstack/react-query';
import type { IUseApiOptions, IUseApiMutationOptions } from '@app-types/hooks';
import type { ApiResponse } from '@app-types/common';
import { createQueryKey } from '@fetch/query-key-factory';
import { callApi } from '@fetch/api';

/**
 * 외부 API 조회를 위한 범용 훅 (GET, POST 조회용)
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
// react-query 관련 코드가 내부 로직이고, callApi 함수는 api 호출 로직이다.
function useApi<T>(endpoint: string, options?: IUseApiOptions<T>): UseQueryResult<NoInfer<T>, Error> {
	const { params, body, queryOptions } = options || {};

	return useQuery({
		// queryKey: body가 있으면 body도 포함, params가 있으면 params 포함
		queryKey: createQueryKey(endpoint, body || params),
		queryFn: async () => {
			const response = await callApi<T>(endpoint, { ...options, apiCallType: 'client' });

			return response.data as T;
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
	options?: IUseApiMutationOptions<TData, TVariables>,
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

/**
 * Form 제출을 통해 Server Action을 호출하는 범용 훅. (Client Component에서 사용)
 *
 * @param action - Server Action 함수
 * @returns {Object} - 훅 반환 객체
 * @returns {boolean} loading - 로딩 상태
 * @returns {T | null} data - 데이터
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} submitAction - Form 제출 함수
 * @returns {Function} reset - 초기화 함수
 * @example
 * const { loading, data, error, submitAction, reset } = useFormAction(action);
 * // Form 제출
 * submitAction(formData);
 * // 초기화
 * reset();
 */
function useFormAction<T>(action: (formData: FormData) => Promise<ApiResponse<T>>) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);

	const submitAction = async (formData: FormData) => {
		setLoading(true);
		setError(null);
		try {
			// Server Action 직접 호출 (formData만 전달)
			// 넘겨받은 action함수를 실행하고 결과를 반환합니다.
			const result = await action(formData);
			console.log('result:::', result);
			if (result.success) {
				setData(result.data as T);
				return result;
			} else {
				setError(result.message as string);
				return result;
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : '[useFormAction]: Server Action 실행 중 오류가 발생했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setData(null);
		setError(null);
		setLoading(false);
	};
	return {
		loading,
		data,
		error,
		submitAction,
		reset,
	};
}

export { useApi, useApiMutation, useFormAction };
