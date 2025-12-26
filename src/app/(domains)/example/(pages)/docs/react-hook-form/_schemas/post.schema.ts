import { z } from 'zod';

/**
 * 게시글 폼 검증 스키마
 * - 클라이언트/서버 양쪽에서 사용 가능
 */
export const PostFormSchema = z.object({
	title: z
		.string()
		.min(2, { message: '제목은 최소 2자 이상이어야 합니다.' })
		.max(100, { message: '제목은 100자를 초과할 수 없습니다.' }),
	body: z
		.string()
		.min(10, { message: '내용은 최소 10자 이상이어야 합니다.' })
		.max(1000, { message: '내용은 1000자를 초과할 수 없습니다.' }),
	email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }).optional().or(z.literal('')),
	category: z.enum(['general', 'tech', 'news'], {
		message: '카테고리를 선택해주세요.',
	}),
	agree: z.boolean().refine((val) => val === true, {
		message: '약관에 동의해주세요.',
	}),
});

/**
 * TypeScript 타입 추출
 */
export type PostFormData = z.infer<typeof PostFormSchema>;
