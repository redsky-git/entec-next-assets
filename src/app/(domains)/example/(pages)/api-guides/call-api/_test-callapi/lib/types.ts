export interface ApiConfig {
	url: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	params?: Record<string, any>;
	data?: any;
	headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data: T;
	message?: string;
	error?: string;
}

export interface PaginatedResponse<T = any> {
	content: T[];
	totalElements: number;
	totalPages: number;
	page: number;
	size: number;
}
