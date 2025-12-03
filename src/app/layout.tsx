import type { IComponent } from '@/core/types/common';
import type { Metadata } from 'next';
import '@/assets/styles/app.css';

import LayoutMainIndex from '@/shared/components/layout/LayoutMainIndex';
import LayoutASideProvider from '@/shared/components/common/context/LayoutASideProvider';

export const metadata: Metadata = {
	title: 'entec-next-assets',
	description: 'Next.js 기반의 Frontend Assets 라이브러리',
};
interface IRootLayoutProps {
	children: React.ReactNode;
}

const RootLayout: IComponent<IRootLayoutProps> = ({ children }) => {
	return (
		<html lang="en">
			<body className="antialiased">
				<LayoutASideProvider>
					<LayoutMainIndex>{children}</LayoutMainIndex>
				</LayoutASideProvider>
			</body>
		</html>
	);
};

RootLayout.displayName = 'RootLayout';
export default RootLayout;
