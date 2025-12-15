// API 엔드포인트 상수 관리
export const API_URI = {
	EXAMPLE: {
		GET_POSTS: '/posts',
		GET_TODOS: (id: string | number) => `/todos/${id}`,
	},
};
