import { getUserList } from './api/actions';

export default async function UserServerPage() {
	// Server Component에서 직접 데이터 조회
	const users = await getUserList({ page: 0, size: 10 });

	return (
		<div>
			<h1>사용자 목록 (Server)</h1>
			<ul>
				{users.content?.map((user: any) => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
		</div>
	);
}
