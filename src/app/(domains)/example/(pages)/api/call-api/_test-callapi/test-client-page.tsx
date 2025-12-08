'use client';

import { useUserList, useCreateUser } from './api/queries';

export default function UserPage() {
	// Client에서 데이터 조회 (React Query)
	const { data: users, isLoading } = useUserList({ page: 0, size: 10 });

	// Mutation 사용
	const createMutation = useCreateUser();

	const handleCreate = () => {
		createMutation.mutate(
			{
				name: 'John Doe',
				email: 'john@example.com',
			},
			{
				onSuccess: () => {
					alert('사용자가 생성되었습니다!');
				},
				onError: (error) => {
					alert(`오류: ${error.message}`);
				},
			},
		);
	};

	if (isLoading) return <div>로딩중...</div>;

	return (
		<div>
			<h1>사용자 목록</h1>
			<button onClick={handleCreate}>사용자 추가</button>
			<ul>
				{users?.content?.map((user: any) => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
		</div>
	);
}
