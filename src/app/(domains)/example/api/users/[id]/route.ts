// ========================================================================================
// src/app/(domains)/example/api/users/[id]/route.ts
// Route Handler for specific user API (Dynamic Route)
// ========================================================================================
import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/core/common/api/server-api';

/**
 * GET /example/api/users/[id]
 * koreanjson.com의 특정 사용자 데이터를 가져옵니다.
 *
 * @example
 * GET /example/api/users/1
 * GET /example/api/users/2
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		// Next.js 15+에서는 params가 Promise일 수 있으므로 await 처리
		const { id } = await params;

		// ID 유효성 검증
		if (!id || isNaN(Number(id))) {
			return NextResponse.json(
				{
					success: false,
					error: '유효하지 않은 사용자 ID입니다.',
					data: null,
				},
				{ status: 400 },
			);
		}

		// serverApi를 사용하여 외부 API 호출
		const response = await serverApi<any>(
			`https://koreanjson.com/users/${id}`,
			{
				method: 'GET',
			},
			{
				// Next.js 캐싱 옵션
				// 금융권 프로젝트에서는 데이터 민감성과 금융 거래의 실시간성 보장을 위해 캐싱을 최소화
				revalidate: 0, // 항상 최신 데이터 fetch (SSR, 캐싱 X)
				tags: ['users', 'user-detail', 'financial'], // 데이터 분류 및 감사 추적을 위한 다중 태그
			},
		);

		// 성공 응답
		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		console.error(`[GET /example/api/users/[id]] Error:`, error);

		// 에러 응답
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : '사용자 정보를 가져오는데 실패했습니다.',
				data: null,
			},
			{ status: 500 },
		);
	}
}
