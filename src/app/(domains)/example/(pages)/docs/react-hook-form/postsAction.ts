'use server';

import { serverApi } from '@/core/common/api/server-api';
import { PostFormSchema, type PostFormData } from './_schemas/post.schema';

/**
 * 게시글 작성 Server Action (with Zod validation)
 * - 서버 측에서 Zod로 재검증
 * - 검증 실패 시 에러 반환
 * - 검증 성공 시 API 호출
 */
export async function createPostAction(prevState: any, formData: FormData) {
	// FormData를 객체로 변환
	const rawData = {
		title: formData.get('title'),
		body: formData.get('body'),
		email: formData.get('email') || '',
		category: formData.get('category'),
		agree: formData.get('agree') === 'true',
	};

	// Zod 스키마로 유효성 검사
	const validated = PostFormSchema.safeParse(rawData);

	// 검증 실패 시
	if (!validated.success) {
		return {
			success: false,
			errors: validated.error.flatten().fieldErrors,
			message: '입력값을 확인해주세요.',
			data: null,
		};
	}

	// 검증 성공 시 API 호출
	try {
		console.log('Validated data:', validated.data);

		const res = await serverApi<any>('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: JSON.stringify({
				title: validated.data.title,
				body: validated.data.body,
				userId: 1,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		console.log('[API Response]:', res);

		if (res.data) {
			return {
				success: true,
				data: res.data,
				message: '게시글이 작성되었습니다.',
				errors: {},
			};
		}

		return {
			success: false,
			message: 'API 응답이 올바르지 않습니다.',
			data: null,
			errors: {},
		};
	} catch (err) {
		console.error('API Error:', err);
		return {
			success: false,
			message: '서버 오류가 발생했습니다.',
			data: null,
			errors: {},
		};
	}
}




