import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { clientAPI } from './client-api-client';
import type { ApiResponse, ApiRequestOptions } from '@app-types/common';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseApiMutationOptions<TData, TVariables> extends Omit<
	UseMutationOptions<TData, Error, TVariables>,
	'mutationFn'
> {
	method?: HttpMethod;
	requestOptions?: ApiRequestOptions;
	invalidateKeys?: readonly unknown[][]; // 성공 시 무효화할 쿼리 키 배열
}

/**
 * API Mutation 요청을 위한 커스텀 useMutation 훅
 * @param endpoint - API 엔드포인트
 * @param options - Mutation 옵션
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
	endpoint: string | ((variables: TVariables) => string),
	options?: UseApiMutationOptions<TData, TVariables>,
): UseMutationResult<TData, Error, TVariables> {
	const queryClient = useQueryClient();
	const { method = 'POST', requestOptions, invalidateKeys, ...mutationOptions } = options || {};

	return useMutation<TData, Error, TVariables>({
		mutationFn: async (variables: TVariables) => {
			const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;

			// 메서드에 따라 적절한 API 호출
			let response: ApiResponse<TData>;

			// 현재 BaseApiClient에 POST, PUT, PATCH, DELETE가 주석처리되어 있으므로
			// 여기서는 구조만 제시합니다. 실제 구현 시 주석을 해제하거나 executeRequest를 직접 사용해야 합니다.
			switch (method) {
				case 'POST':
					// response = await clientAPI.post<TData>(url, variables, requestOptions);
					throw new Error('POST method not implemented yet');
				case 'PUT':
					// response = await clientAPI.put<TData>(url, variables, requestOptions);
					throw new Error('PUT method not implemented yet');
				case 'PATCH':
					// response = await clientAPI.patch<TData>(url, variables, requestOptions);
					throw new Error('PATCH method not implemented yet');
				case 'DELETE':
					// response = await clientAPI.delete<TData>(url, requestOptions);
					throw new Error('DELETE method not implemented yet');
				default:
					throw new Error(`Unsupported method: ${method}`);
			}

			if (!response.success) {
				throw new Error(response.error || 'API 요청 실패');
			}

			return response.data as TData;
		},
		onSuccess: (data, variables, context) => {
			// 지정된 쿼리 키들을 무효화
			if (invalidateKeys) {
				invalidateKeys.forEach((key) => {
					queryClient.invalidateQueries({ queryKey: key });
				});
			}

			// 사용자 정의 onSuccess 콜백 실행
			mutationOptions.onSuccess?.(data, variables, context);
		},
		...mutationOptions,
	});
}

/**
 * 낙관적 업데이트를 위한 헬퍼 함수
 */
export function useOptimisticMutation<TData = unknown, TVariables = unknown>(
	endpoint: string | ((variables: TVariables) => string),
	queryKeyToUpdate: readonly unknown[],
	options?: UseApiMutationOptions<TData, TVariables> & {
		updateFn: (oldData: any, variables: TVariables) => any;
	},
): UseMutationResult<TData, Error, TVariables> {
	const queryClient = useQueryClient();
	const { updateFn, ...restOptions } = options || ({} as any);

	return useApiMutation<TData, TVariables>(endpoint, {
		...restOptions,
		onMutate: async (variables) => {
			// 진행 중인 쿼리 취소
			await queryClient.cancelQueries({ queryKey: queryKeyToUpdate });

			// 이전 데이터 백업
			const previousData = queryClient.getQueryData(queryKeyToUpdate);

			// 낙관적 업데이트 수행
			if (updateFn && previousData) {
				queryClient.setQueryData(queryKeyToUpdate, updateFn(previousData, variables));
			}

			return { previousData };
		},
		onError: (err, variables, context: any) => {
			// 에러 발생 시 이전 데이터로 롤백
			if (context?.previousData) {
				queryClient.setQueryData(queryKeyToUpdate, context.previousData);
			}

			restOptions.onError?.(err, variables, context);
		},
		onSettled: () => {
			// 쿼리 무효화하여 서버 데이터와 동기화
			queryClient.invalidateQueries({ queryKey: queryKeyToUpdate });
		},
	});
}
