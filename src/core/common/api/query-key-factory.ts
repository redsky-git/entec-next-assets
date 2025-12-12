import { QueryParams } from '@app-types/common';

/**
 * API endpoint와 params를 기반으로 queryKey를 동적 생성
 * @param endpoint - API endpoint (예: 'users', 'posts/123')
 * @param params - 쿼리 파라미터 객체
 * @returns React Query에서 사용할 queryKey
 */
export const createQueryKey = (endpoint: string, params?: QueryParams): readonly unknown[] => {
	// endpoint를 '/'로 분리하여 계층 구조 생성
	// filter(Boolean)의 역할: split('/')을 사용하면, 예를 들어 '/users/123' 처럼 앞에 슬래시가 있는 경우 첫 요소로 빈 문자열('')이 나올 수 있는데,
	// filter(Boolean)는 이러한 빈 문자열 요소를 제거하여 실제 path segment만 남도록 한다.
	const pathSegments = endpoint.split('/').filter((segment) => Boolean(segment));

	if (!params || Object.keys(params).length === 0) {
		return pathSegments;
	}

	// undefined와 null 값 제거 (key와 value)를 확인하여 누적객엔 acc에 추가
	const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
		if (value !== undefined && value !== null) {
			acc[key] = value;
		}
		return acc;
	}, {} as QueryParams);

	// 정제된 params가 비어있으면 params 없이 반환
	if (Object.keys(cleanParams).length === 0) {
		return pathSegments;
	}

	return [...pathSegments, cleanParams] as const;
};

/**
 * 템플릿 리터럴 방식의 queryKey 생성
 */
export function qkey(strings: TemplateStringsArray, ...values: any[]) {
	const endpoint = strings
		.reduce((acc, str, i) => {
			return acc + str + (values[i] !== undefined ? String(values[i]) : '');
		}, '')
		.trim();

	return (params?: QueryParams) => createQueryKey(endpoint, params);
}
