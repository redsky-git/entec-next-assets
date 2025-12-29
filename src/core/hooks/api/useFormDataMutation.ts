import { useMutation, UseMutationOptions } from '@tanstack/react-query';

/**
 * FormData를 Router Handler로 전송하는 범용 useMutation 훅
 *
 * @param endpoint - API 엔드포인트 (예: '/example/api/form-submit')
 * @param options - useMutation 옵션
 * @returns useMutation 결과 객체
 *
 * @example
 * // 기본 사용
 * const mutation = useFormDataMutation('/api/form-submit');
 * const formData = new FormData(form);
 * const formValues = Object.fromEntries(formData.entries());
 * mutation.mutate(formValues);
 *
 * @example
 * // 콜백 사용
 * const mutation = useFormDataMutation('/api/form-submit', {
 *   onSuccess: (data) => console.log('성공:', data),
 *   onError: (error) => console.error('에러:', error),
 * });
 *
 * @note
 * FormData 객체는 postMessage로 직렬화할 수 없어서 TanStack Query DevTools에서 에러가 발생합니다.
 * 따라서 FormData 대신 일반 객체(Record<string, any>)를 받아서 내부에서 FormData로 변환합니다.
 */
export function useFormDataMutation<TData = unknown>(
	endpoint: string,
	options?: Omit<UseMutationOptions<TData, Error, Record<string, any>>, 'mutationFn'>,
) {
	return useMutation<TData, Error, Record<string, any>>({
		mutationFn: async (formValues) => {
			// 일반 객체를 FormData로 변환
			const formData = new FormData();
			Object.entries(formValues).forEach(([key, value]) => {
				if (value instanceof File || value instanceof Blob) {
					formData.append(key, value);
				} else if (Array.isArray(value)) {
					// 배열인 경우 각 요소를 추가
					value.forEach((item) => formData.append(key, item));
				} else {
					formData.append(key, String(value));
				}
			});

			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData, // FormData를 직접 전달 (Content-Type은 자동 설정)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
			}

			// 204 No Content 처리
			if (response.status === 204) {
				return null as TData;
			}

			return response.json() as Promise<TData>;
		},
		...options,
	});
}
