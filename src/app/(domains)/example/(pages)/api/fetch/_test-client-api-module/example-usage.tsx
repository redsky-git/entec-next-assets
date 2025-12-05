'use client';

import { useApiQuery } from './use-api-query';
import { useApiMutation } from './use-api-mutation';
import { queryKeys } from './query-keys';
import { API_ENDPOINTS } from './api-endpoints';

// 타입 정의
interface User {
	id: number;
	name: string;
	email: string;
}

interface Post {
	id: number;
	title: string;
	content: string;
	userId: number;
}

interface CreatePostRequest {
	title: string;
	content: string;
}

// =====================
// 1. Query 사용 예시
// =====================
export function UserProfile() {
	const {
		data: user,
		isLoading,
		error,
	} = useApiQuery<User>(queryKeys.user.profile(), API_ENDPOINTS.USER.GET_PROFILE, {
		staleTime: 10 * 60 * 1000, // 10분
		retry: 2,
	});

	if (isLoading) return <div>로딩중...</div>;
	if (error) return <div>에러: {error.message}</div>;
	if (!user) return <div>데이터 없음</div>;

	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
		</div>
	);
}

// =====================
// 2. 동적 엔드포인트 Query 예시
// =====================
export function PostDetail({ postId }: { postId: number }) {
	const { data: post, isLoading } = useApiQuery<Post>(
		queryKeys.post.detail(postId),
		API_ENDPOINTS.POST.GET_DETAIL(postId),
		{
			enabled: !!postId, // postId가 있을 때만 요청
		},
	);

	if (isLoading) return <div>로딩중...</div>;

	return (
		<div>
			<h2>{post?.title}</h2>
			<p>{post?.content}</p>
		</div>
	);
}

// =====================
// 3. 리스트 Query with Filters 예시
// =====================
export function PostList({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
	const filters = { page, limit };

	const { data: posts, isLoading } = useApiQuery<Post[]>(
		queryKeys.post.list(filters),
		API_ENDPOINTS.createEndpoint(API_ENDPOINTS.POST.GET_LIST, filters),
		{
			keepPreviousData: true, // 페이지 전환 시 이전 데이터 유지
		},
	);

	if (isLoading) return <div>로딩중...</div>;

	return (
		<ul>
			{posts?.map((post) => (
				<li key={post.id}>{post.title}</li>
			))}
		</ul>
	);
}

// =====================
// 4. Mutation 사용 예시 (POST)
// =====================
export function CreatePostForm() {
	const mutation = useApiMutation<Post, CreatePostRequest>(API_ENDPOINTS.POST.CREATE, {
		method: 'POST',
		// 성공 시 포스트 목록 쿼리 무효화
		invalidateKeys: [queryKeys.post.lists()],
		onSuccess: (data) => {
			console.log('게시글 생성 성공:', data);
			alert('게시글이 생성되었습니다!');
		},
		onError: (error) => {
			console.error('게시글 생성 실패:', error);
			alert('게시글 생성에 실패했습니다.');
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		mutation.mutate({
			title: formData.get('title') as string,
			content: formData.get('content') as string,
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				name="title"
				placeholder="제목"
				required
			/>
			<textarea
				name="content"
				placeholder="내용"
				required
			/>
			<button
				type="submit"
				disabled={mutation.isPending}
			>
				{mutation.isPending ? '생성중...' : '게시글 생성'}
			</button>
		</form>
	);
}

// =====================
// 5. 동적 엔드포인트 Mutation 예시 (DELETE)
// =====================
export function DeletePostButton({ postId }: { postId: number }) {
	const mutation = useApiMutation<void, number>((id) => API_ENDPOINTS.POST.DELETE(id), {
		method: 'DELETE',
		invalidateKeys: [queryKeys.post.lists(), queryKeys.post.detail(postId)],
		onSuccess: () => {
			alert('게시글이 삭제되었습니다.');
		},
	});

	return (
		<button
			onClick={() => mutation.mutate(postId)}
			disabled={mutation.isPending}
		>
			{mutation.isPending ? '삭제중...' : '삭제'}
		</button>
	);
}

// =====================
// 6. Prefetch 예시
// =====================
import { getQueryClient } from './query-client-config';

export async function prefetchPostDetail(postId: number) {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: queryKeys.post.detail(postId),
		queryFn: async () => {
			const response = await clientAPI.get<Post>(API_ENDPOINTS.POST.GET_DETAIL(postId));
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
	});
}
