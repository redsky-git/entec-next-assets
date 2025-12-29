'use server';

import { serverApi } from '@fetch/server-api';

export async function postsAction(formData: FormData) {
	//const id = formData.get('id') as string;
	const title = formData.get('title') as string;
	const body = formData.get('body') as string;
	const id = formData.get('id') as string;

	console.log('Received:', { title, body, id });

	try {
		// serverApi 호출 (Server Action)
		// Next.js Server Action에서는 FormData를 직접 전달할 수 있습니다.
		// serverApi 내부의 fetch가 FormData를 감지하여 자동으로 Content-Type: multipart/form-data를 설정합니다.
		const res = await serverApi<any>('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: formData,
			cache: 'no-store',
		});

		console.log('[https://jsonplaceholder.typicode.com/posts] response:', res);
		console.log('[https://jsonplaceholder.typicode.com/posts] error:', res.message);

		// 성공 처리
		if (res.data) {
			console.log('[https://jsonplaceholder.typicode.com/posts] response:', res.data);
			// 성공 응답
			return { success: true, message: '게시글이 작성되었습니다.', data: res.data };
		} else {
			return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
		}
	} catch (err) {
		console.error('API Error:', err);
		return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
	}
}
