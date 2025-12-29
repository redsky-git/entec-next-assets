import { useState } from 'react';
import { useQuery, UseQueryResult, useMutation } from '@tanstack/react-query';
import type { IUseApiOptions, IUseApiMutationOptions } from '@app-types/hooks';
import type { ApiRequestConfig, ApiResponse } from '@app-types/common';
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
 * FormData도 지원하며, 내부에서 자동으로 변환 처리
 *
 * @example
 * // POST 요청 (JSON)
 * const createUser = useApiMutation<User, CreateUserInput>('users', { method: 'POST' });
 * createUser.mutate({ name: 'John', email: 'john@example.com' });
 *
 * // POST 요청 (FormData)
 * const uploadFile = useApiMutation<Response, FormData>('upload', { method: 'POST' });
 * const formData = new FormData();
 * formData.append('file', file);
 * uploadFile.mutate(formData); // FormData를 직접 전달 가능
 *
 * // PUT 요청
 * const updateUser = useApiMutation<User, UpdateUserInput>('users/1', { method: 'PUT' });
 * updateUser.mutate({ name: 'Jane' });
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
	const requestOptions = { ...options };

	// useMutation을 생성 (내부적으로는 항상 Record<string, any>로 처리)
	const mutation = useMutation<TData, Error, Record<string, any>>({
		mutationFn: async (variables: Record<string, any>) => {
			// variables는 이미 일반 객체로 변환된 상태
			const callApiOptions: ApiRequestConfig = {
				...requestOptions,
				body: variables,
				apiCallType: 'client',
			};
			const response = await callApi<TData>(endpoint, callApiOptions);
			return response.data as TData;
		},
		// mutationOptions의 타입 호환을 위해 any로 캐스팅
		...(requestOptions.mutationOptions as any),
	});

	// mutate 함수를 래핑하여 FormData 처리
	const originalMutate = mutation.mutate;
	const wrappedMutate = (variables: TVariables, ...args: any[]) => {
		// FormData인지 체크 (타입 가드)
		const variablesAsAny = variables as any;
		const isFormData =
			typeof FormData !== 'undefined' &&
			typeof variablesAsAny === 'object' &&
			variablesAsAny !== null &&
			variablesAsAny instanceof FormData;

		if (isFormData) {
			// FormData를 일반 객체로 변환
			const formValues: Record<string, any> = {};
			(variablesAsAny as FormData).forEach((value: FormDataEntryValue, key: string) => {
				// File이나 Blob은 그대로 유지
				const valueAsAny = value as any;
				if (valueAsAny instanceof File || valueAsAny instanceof Blob) {
					formValues[key] = valueAsAny;
				} else {
					formValues[key] = value.toString();
				}
			});
			// 변환된 객체로 호출
			return originalMutate(formValues, ...args);
		} else {
			// 일반 객체는 그대로 전달
			return originalMutate(variablesAsAny, ...args);
		}
	};

	// mutateAsync도 래핑
	const originalMutateAsync = mutation.mutateAsync;
	const wrappedMutateAsync = async (variables: TVariables, ...args: any[]) => {
		// FormData인지 체크
		const variablesAsAny = variables as any;
		const isFormData =
			typeof FormData !== 'undefined' &&
			typeof variablesAsAny === 'object' &&
			variablesAsAny !== null &&
			variablesAsAny instanceof FormData;

		if (isFormData) {
			const formValues: Record<string, any> = {};
			(variablesAsAny as FormData).forEach((value: FormDataEntryValue, key: string) => {
				const valueAsAny = value as any;
				if (valueAsAny instanceof File || valueAsAny instanceof Blob) {
					formValues[key] = valueAsAny;
				} else {
					formValues[key] = value.toString();
				}
			});
			return originalMutateAsync(formValues, ...args);
		} else {
			return originalMutateAsync(variablesAsAny, ...args);
		}
	};

	// 래핑된 함수로 교체
	return {
		...mutation,
		mutate: wrappedMutate as typeof mutation.mutate,
		mutateAsync: wrappedMutateAsync as typeof mutation.mutateAsync,
	};
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
