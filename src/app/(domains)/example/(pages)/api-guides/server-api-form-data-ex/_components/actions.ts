'use server';

import { serverApi } from '@fetch/server-api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface IPostResponse {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	UserId: number;
}

export async function submitForm(formData: FormData) {
	//const id = formData.get('id') as string;
	const title = formData.get('title') as string;
	const body = formData.get('body') as string;
	const userId = formData.get('userId') as string;

	// 데이터베이스 저장 등의 작업
	console.log('Received:', { title, body, userId });

	try {
		// serverApi 호출 (Server Action)
		// Next.js Server Action에서는 FormData를 직접 전달할 수 있습니다.
		// serverApi 내부의 fetch가 FormData를 감지하여 자동으로 Content-Type: multipart/form-data를 설정합니다.
		const res = await serverApi<IPostResponse>('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: formData,
			cache: 'no-store',
			//headers: {
			//	'Content-Type': 'multipart/form-data',
			//},
		});

		console.log('[https://jsonplaceholder.typicode.com/posts] response:', res);
		console.log('[https://jsonplaceholder.typicode.com/posts] error:', res.message);
		// 쿠키에 결과 저장 (임시)
		(await cookies()).set('lastPost', JSON.stringify(res), { maxAge: 60 });
		// 성공 페이지로 리다이렉트
		redirect('/example/api-guides/server-api-form-data-ex');
		if (res.data) {
			//setResponse(res.data);
			console.log('[https://jsonplaceholder.typicode.com/posts] response:', res.data);
			// 성공 응답
			return { success: true, message: '폼이 제출되었습니다.', data: res.data };
		}
	} catch (err) {
		console.error('API Error:', err);
		return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
	} finally {
		//setIsLoading(false);
	}
	return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
}
