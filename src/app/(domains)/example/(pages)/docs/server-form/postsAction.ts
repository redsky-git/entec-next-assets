'use server';

import { serverApi } from '@fetch/server-api';
import { cookies } from 'next/headers';
//import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
			// 쿠키에 결과 저장하여 전달 방법 (임시)
			(await cookies()).set('result_posts', JSON.stringify(res), { maxAge: 60 });

			// 성공 페이지로 리다이렉트 (query parameter 포함)
			const params = new URLSearchParams({
				success: 'true',
				message: '게시글이 작성되었습니다.',
				status: res?.status?.toString() || '',
				id: res.data.id?.toString() || '',
			});

			// 캐시 무효화 (필요시 주석 해제)
			// revalidatePath('/example/docs/server-form');

			// redirect는 함수를 종료시키므로 아래 코드는 실행되지 않음
			redirect(`/example/docs/server-form?${params.toString()}`);
		}
	} catch (err) {
		// NEXT_REDIRECT 에러는 정상적인 redirect 동작이므로 다시 throw
		// redirect()는 내부적으로 에러를 throw하여 작동하므로 이를 다시 throw해야 함
		if (
			err &&
			typeof err === 'object' &&
			'digest' in err &&
			typeof err.digest === 'string' &&
			err.digest.startsWith('NEXT_REDIRECT')
		) {
			throw err;
		}
		console.error('API Error:', err);
		return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
	} finally {
		//setIsLoading(false);
	}
	return { success: false, message: '폼이 제출되지 않았습니다.', data: null };
}
