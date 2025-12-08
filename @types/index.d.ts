//import type { IRouter } from '@/app/types/router';
//import type { IUtils } from '@/app/types/common';
//import type { IUI } from '@/app/types/components';

export {};

declare global {
	interface Window {
		//$router: IRouter;
		//$util: IUtils;
		//$ui: IUI;
		// Tanstack Query Client를 전역 변수로 설정(Devtools Extension 사용 시 필요) =======
		__TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
	}

	//const $router: IRouter;
	//const $util: IUtils;
	//const $ui: IUI;

	// Tanstack Query Client를 전역 변수로 설정(Devtools Extension 사용 시 필요) =======
	const __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
}
