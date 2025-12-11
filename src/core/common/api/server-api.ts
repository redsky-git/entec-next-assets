'use server';

import { ApiRequestConfig, ApiResponse, NextFetchRequestConfig } from '@app-types/common/app-api-types';
import { callApi } from '@fetch/api';

export async function serverApi<T = any>(
	endpoint: string,
	config: ApiRequestConfig = {},
	nextConfig: NextFetchRequestConfig = {},
): Promise<ApiResponse<T>> {
	const response = await callApi(endpoint, { ...config, apiCallType: 'server' }, nextConfig);
	return response;
}
