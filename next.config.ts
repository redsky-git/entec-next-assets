import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
