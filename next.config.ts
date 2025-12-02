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
};

export default nextConfig;
