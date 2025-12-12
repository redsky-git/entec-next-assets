import { QueryParams, THttpMethod } from '@app-types/common';
import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

export interface IUseApiOptions<T> {
	/** HTTP Method (기본값: 'GET') */
	method?: THttpMethod;
	/** Query parameters (주로 GET 요청 시 사용) */
	params?: QueryParams;
	/** Request body (POST/PUT/PATCH/DELETE 요청 시 사용) */
	body?: Record<string, any>;
	/** Custom headers */
	headers?: Record<string, string>;
	/** React Query options */
	queryOptions?: UseQueryOptions<T> | UseMutationOptions<T>;
	/** Request timeout */
	timeout?: number;
	/** API Call Type (기본값: 'client') */
	apiCallType?: 'client' | 'server';
}

export interface IUseApiMutationOptions<TData, TVariables> {
	/** HTTP Method (기본값: 'POST') */
	method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	/** Custom headers */
	headers?: Record<string, string>;
	/** React Query mutation options */
	mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
}
