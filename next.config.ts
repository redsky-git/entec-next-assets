import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false, // Strict Mode 비활성화 (useEffect 중복 실행 방지)
	async redirects() {
		return [
			{
				source: '/',
				destination: '/main', // 원하는 경로
				permanent: false, // 301 redirect (false면 307)
			},
		];
	},
	//async rewrites() {
	//	return [
	//		{
	//			source: '/api/v1/:path*',
	//			destination: 'https://hn.algolia.com/:path*', //https://hn.algolia.com/api/v1/search
	//		},
	//	];
	//},
};

export default nextConfig;
