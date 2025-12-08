// ============================================================================
// 8. app/(domains)/example/api/call-api/_test-callapi/api/actions.ts - 도메인별 Server Action 예시
// ============================================================================

'use server';

import { serverApi } from '../lib/server-action';
import { revalidatePath } from 'next/cache';

// 사용자 목록 조회 (Server Component용)
export async function getUserList(params?: { page?: number; size?: number }) {
	return serverApi({ url: '/api/users', method: 'GET', params });
}

// 사용자 상세 조회 (Server Component용)
export async function getUserDetail(userId: string) {
	return serverApi({ url: `/api/users/${userId}`, method: 'GET' });
}

// 사용자 생성 (Server Action)
export async function createUser(data: any) {
	const result = await serverApi({ url: '/api/users', method: 'POST', data });

	revalidatePath('/users'); // 캐시 무효화
	return result;
}

// 사용자 수정 (Server Action)
export async function updateUser(userId: string, data: any) {
	const result = await serverApi({ url: `/api/users/${userId}`, method: 'PUT', data });
	revalidatePath(`/users/${userId}`); // 캐시 무효화
	return result;
}

// 사용자 삭제 (Server Action)
export async function deleteUser(userId: string) {
	const result = await serverApi({ url: `/api/users/${userId}`, method: 'DELETE' });
	revalidatePath('/users'); // 캐시 무효화
	return result;
}
