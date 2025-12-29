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
	/** React Query options (queryKey와 queryFn은 내부에서 자동 생성됨) */
	queryOptions?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>;
	/** Request timeout */
	timeout?: number;
	/** API Call Type (기본값: 'client') */
	apiCallType?: 'client' | 'server';
}

export interface IUseApiMutationOptions<TData, TVariables> {
	/** HTTP Method (기본값: 'POST') */
	method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	/** Query parameters (주로 GET 요청 시 사용) */
	params?: QueryParams;
	/** Request body (POST/PUT/PATCH/DELETE 요청 시 사용) */
	body?: Record<string, any>;
	/** Custom headers */
	headers?: Record<string, string>;
	/** React Query mutation options (mutationKey와 mutationFn은 내부에서 자동 생성됨) */
	mutationOptions?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationKey' | 'mutationFn'>;
	/** Request timeout */
	timeout?: number;
}
