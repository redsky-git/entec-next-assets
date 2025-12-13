// Server Component - SEO 최적화를 위해 서버에서 데이터를 가져옴
import type { Metadata } from 'next';
import { serverApi } from '@fetch/server-api';
import CallApiClientEx from './CallApiClientEx';

interface IPost {
	id: number;
	title: string;
	body: string;
}

// SEO를 위한 메타데이터 생성
/**
 * export async function: Next.js가 인식하는 특수 함수
 * Promise<Metadata>: Next.js의 Metadata 타입 반환
 * 서버에서만 실행: Server Component에서만 사용 가능
 * generateMetadata: Next.js의 특수 함수
 * Metadata: Next.js의 메타데이터 타입
 * Server Component에서만 실행: Server Component에서만 사용 가능
 * Promise<Metadata>: Next.js의 Metadata 타입 반환
 * export async function: Next.js가 인식하는 특수 함수
 * Promise<Metadata>: Next.js의 Metadata 타입 반환
 * Server Component에서만 실행: Server Component에서만 사용 가능
 * 
 * 생성되는 HTML
이 함수가 생성하는 메타데이터는 다음과 같은 HTML로 변환됩니다:
<head>    <title>Posts 목록 (100개)</title>    <meta name="description" content="총 100개의 포스트가 있습니다." />    <!-- 기타 메타 태그들 --></head>
SEO 효과
1. 검색 엔진 최적화
동적 제목: 포스트 개수 반영
동적 설명: 현재 상태 반영
소셜 미리보기: Open Graph 등에도 활용 가능
2. 사용자 경험
브라우저 탭 제목: 동적 정보 표시
북마크: 의미 있는 제목 저장
공유 시: 의미 있는 미리보기 제공
추가 가능한 메타데이터
더 많은 메타데이터를 추가할 수 있습니다:
export async function generateMetadata(): Promise<Metadata> {    try {        const response = await serverApi<IPost[]>('posts');        const posts = response.data || [];                return {            title: `Posts 목록 (${posts.length}개)`,            description: `총 ${posts.length}개의 포스트가 있습니다.`,            // 추가 메타데이터            keywords: ['posts', 'blog', 'articles'],            openGraph: {                title: `Posts 목록 (${posts.length}개)`,                description: `총 ${posts.length}개의 포스트가 있습니다.`,                type: 'website',            },            twitter: {                card: 'summary',                title: `Posts 목록 (${posts.length}개)`,                description: `총 ${posts.length}개의 포스트가 있습니다.`,            },        };    } catch {        // ...    }}
실행 시점
빌드 타임 (Static Generation): 정적 페이지 생성 시
요청 타임 (SSR): 각 요청마다 실행
Page 컴포넌트보다 먼저 실행되어 메타데이터를 먼저 생성
요약
목적: 동적 메타데이터 생성으로 SEO 개선
실행 위치: 서버에서만 실행
장점: 데이터 기반 동적 메타데이터, 에러 처리, 검색 엔진 최적화
결과: HTML <head>에 자동 삽입되는 메타 태그
이 함수로 각 페이지의 메타데이터를 동적으로 관리할 수 있습니다.
 */
export async function generateMetadata(): Promise<Metadata> {
	try {
		const response = await serverApi<IPost[]>('posts');
		const posts = response.data || [];

		return {
			title: `Posts 목록 (${posts.length}개)`,
			description: `총 ${posts.length}개의 포스트가 있습니다.`,
		};
	} catch {
		return {
			title: 'Posts 목록',
			description: '포스트 목록을 확인하세요.',
		};
	}
}

// Server Component에서 데이터를 가져와서 Client Component에 전달
export default async function Page() {
	let initialPostsData: IPost[] = [];

	try {
		// 서버에서 데이터를 가져옴 (SSR)
		const response = await serverApi<IPost[]>('posts');
		/*
		 const response = await serverApi<IPost[]>('http://ws.bus.go.kr/api/rest/buspos/getBusPosByRouteStList', {
			params: {
				serviceKey: 'bdee51ff8fe2dae8bfc4cbdd7df75a7dfce5f5e2801242ece9bb9aad9b64ec60',
				busRouteId: '100100118',
				startOrd: '1',
				endOrd: '10',
				resultType: 'json',
			},
		});
		 */
		initialPostsData = response.data || [];
	} catch (error) {
		console.error('Failed to fetch posts on server:', error);
		// 에러 발생 시 빈 배열로 초기화
		initialPostsData = [];
	}

	// Client Component에 초기 데이터를 props로 전달
	return <CallApiClientEx initialPostsData={initialPostsData} />;
}
