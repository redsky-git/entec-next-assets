import type { Metadata } from 'next';
import '@/assets/styles/app.css';

import LayoutMainIndex from '../shared/components/layout/LayoutMainIndex';

export const metadata: Metadata = {
	title: 'entec-next-assets',
	description: 'Next.js 기반의 Frontend Assets 라이브러리',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased`}>
				<LayoutMainIndex>{children}</LayoutMainIndex>
			</body>
		</html>
	);
}
