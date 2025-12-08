// ============================================================================
// 7. app/(domains)/example/api/call-api/_test-callapi/api/queries.ts - 도메인별 Query 정의 예시
// ============================================================================

'use client';

import { useApiQuery, useApiMutation } from '../lib/use-api';
import { queryKeys } from '../lib/query-keys';

// 사용자 목록 조회
export function useUserList(params?: { page?: number; size?: number }) {
	return useApiQuery(queryKeys.user.list(params), { url: '/api/users', method: 'GET', params });
}

// 사용자 상세 조회
export function useUserDetail(userId: string) {
	return useApiQuery(
		queryKeys.user.detail(userId),
		{ url: `/api/users/${userId}`, method: 'GET' },
		{
			enabled: !!userId, // userId가 있을 때만 실행
		},
	);
}

// 사용자 생성
export function useCreateUser() {
	return useApiMutation({ url: '/api/users', method: 'POST' });
}

// 사용자 수정
export function useUpdateUser(userId: string) {
	return useApiMutation(
		{ url: `/api/users/${userId}`, method: 'PUT' },
		{
			onSuccess: () => {
				//toast.success('사용자 수정 성공');
				alert('사용자 수정 성공');
			},
		},
	);
}

// 사용자 삭제
export function useDeleteUser() {
	return useApiMutation({ url: '/api/users', method: 'DELETE' });
}
