// ========================================================================================
// src/app/(domains)/example/api/posts/route.ts
// Route Handler for users API
// ========================================================================================
import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/core/common/api/server-api';

/**
 * GET /example/api/posts
 * koreanjson.com의 posts 데이터를 가져옵니다.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
	try {
		// serverApi를 사용하여 외부 API 호출
		const response = await serverApi<any[]>(
			'https://koreanjson.com/posts',
			{
				method: 'GET',
			},
			{
				// Next.js 캐싱 옵션
				// 금융권 프로젝트에서는 데이터 민감성과 금융 거래의 실시간성 보장을 위해 캐싱을 최소화
				revalidate: 0, // 항상 최신 데이터 fetch (SSR, 캐싱 X)
				tags: ['posts', 'financial'], // 데이터 분류 및 감사 추적을 위한 다중 태그
			},
		);

		// 성공 응답
		return NextResponse.json(response.data, { status: 200 });
		//return NextResponse.json(
		//	{
		//		success: true,
		//		data: response.data,
		//		message: '사용자 목록을 성공적으로 가져왔습니다.',
		//	},
		//	{ status: 200 },
		//);
	} catch (error) {
		console.error('[GET /example/api/posts] Error:', error);

		// 에러 응답
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'posts 목록을 가져오는데 실패했습니다.',
				data: null,
			},
			{ status: 500 },
		);
	}
}
