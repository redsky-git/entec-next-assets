import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

// api instance config 타입 정의
// axiosInstance를 생성할 때 사용되는 config 타입
// baseURL: API 기본 URL
// timeout: API 요청 시간 초과 시간
// headers: API 요청 시 헤더
export type ApiInstanceConfig = {
	baseURL?: string;
	timeout?: number; // API 요청 시간 초과 시간
	headers?: Record<string, string>; // API 요청 시 헤더
};

/**
 * API 응답 타입 정의(new)
 *
 * @template T - 응답 데이터의 타입
 * @property {boolean} success - API 요청의 성공 여부
 * @property {T} [data] - API 요청의 결과 데이터
 * @property {string} [error] - API 요청 실패 시 에러 메시지
 * @property {string} [message] - API 요청의 결과 메시지(옵션)
 * @property {number} [statusCode] - API 응답의 HTTP 상태 코드
 * @property {AxiosResponse<T> | null} [_rawResponse] - 원본 Axios 응답 객체(디버깅/세부 정보용, 옵션)
 */
export type ApiResponse<T = any> = {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	statusCode?: number;
	/**
	 * 원본 Axios 응답 객체(rawResponse)
	 * - Axios 요청의 전체 응답 객체를 포함합니다.
	 * - API 응답의 헤더, 상태코드, 등 axios 레벨에서 제공하는 세부 정보를 참고하고 싶을 때 사용합니다.
	 * - 일반적으로 최상위 레벨에서 잘 쓰지 않지만, 필요시 디버깅이나 세부 정보 접근 목적으로 활용합니다.
	 */
	_rawResponse?: AxiosResponse<T> | null;
};

// api request options 타입 정의 (new)
// headers: API 요청 시 헤더
// timeout: API 요청 시간 초과 시간
// cache: Next.js 특화 옵션 (서버에서만 사용)
// revalidate: API 요청 결과 재검증 시간
// tags: API 요청 결과 태그
export type ApiRequestOptions = {
	headers?: Record<string, string>;
	timeout?: number;
	// Next.js 특화 옵션 (서버에서만 사용)
	cache?: RequestCache;
	revalidate?: number | false;
	tags?: string[];
};

// 현재 프로젝트에서 사용해야할 response타입.
export type APIResponseType<T> = Promise<AxiosResponse<IResponse<T>>>;
// 공통 response가 정해지지 않은 외부 api사용을 위한 경우 IResponse를 빼고 호출한다.
export type defaultAPIResponseType<T> = Promise<AxiosResponse<T>>;

export type CommonRequestHeader = AxiosRequestHeaders & {
	//'Content-Type'?: aaa;
	//Accept?: any;
	//Transfer?: string;
	test?: string;
};

export interface CommonRequestConfig extends AxiosRequestConfig {
	// 이 요청이 static인지 api요청인지 여부.
	isStatic?: boolean;
	// 헤더값 변경이 필요한 경우 사용할 필드
	headers?: CommonRequestHeader;
	// api중복거래 호출 가능여부 설정 - options 객체를 통해서만 받는다.
	allowDuplicate?: boolean;
	disableLoadingSpinner?: boolean;
	isSetParams?: boolean;
	// ajax중복체크 확인 시 사용한 hash data를 전달하기 위한 값
	unresolvedHash?: any;
}

export interface CommonRequestInterceptorsConfig extends InternalAxiosRequestConfig {
	// 이 요청이 static인지 api요청인지 여부.
	isStatic?: boolean;
	// 헤더값 변경이 필요한 경우 사용할 필드
	headers: CommonRequestHeader;
	// api중복거래 호출 가능여부 설정 - options 객체를 통해서만 받는다.
	allowDuplicate?: boolean;
	disableLoadingSpinner?: boolean;
	isSetParams?: boolean;
	// ajax중복체크 확인 시 사용한 hash data를 전달하기 위한 값
	unresolvedHash?: any;
}

// --------------------------------------------------------------
// API response 레이아웃 정의 (BGN)---------------------------------
// --------------------------------------------------------------
export interface IResponse<DataType> {
	hdr: IResponseHeader;
	bdy: DataType;
}

export interface IResponseHeader {
	rsCd: string;
	rsMsg: string;
	svrDt: string;
}
