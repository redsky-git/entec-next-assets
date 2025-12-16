'use server';

import { serverApi } from '@fetch/server-api';

interface IPostResponse {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	UserId: number;
}

export async function submitForm(formData: FormData) {
	const id = formData.get('id') as string;
	const title = formData.get('title') as string;
	const content = formData.get('content') as string;
	const UserId = formData.get('UserId') as string;

	// 데이터베이스 저장 등의 작업
	console.log('Received:', { id, title, content, UserId });

	try {
		// serverApi 호출 (Server Action)
		// Next.js Server Action에서는 FormData를 직접 전달할 수 있습니다.
		// serverApi 내부의 fetch가 FormData를 감지하여 자동으로 Content-Type: multipart/form-data를 설정합니다.
		const res = await serverApi<IPostResponse>('https://koreanjson.com/posts', {
			method: 'POST',
			body: formData,
			cache: 'no-store',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		console.log('[https://koreanjson.com/posts] response:', res);
		console.log('[https://koreanjson.com/posts] error:', res.message);
		if (res.data) {
			//setResponse(res.data);
			console.log('[https://koreanjson.com/posts] response:', res.data);
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
