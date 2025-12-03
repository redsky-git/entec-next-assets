'use client';

import type { IComponent } from '@/core/types/common';

//import { Outlet, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { NAV_DATA } from '@/shared/constants/nav-data';

import { AppSidebar } from '@/core/components/shadcn/app-sidebar';
import { SiteHeader } from '@/core/components/shadcn/site-header';
import { SidebarInset, SidebarProvider } from '@/core/components/shadcn/ui/sidebar';

import LayoutASide from './LayoutASide';
import { useHeadings } from '@/core/hooks/layout/use-headings';

interface ILayoutMainIndexProps {
	message?: string;
	subMessage?: string;
	children: React.ReactNode;
}

const LayoutMainIndex: IComponent<ILayoutMainIndexProps> = ({ children }) => {
	const pathname = usePathname();
	//const navigate = useNavigate();
	//const location = useLocation();
	//$router.setNaviInstance(navigate);
	//$router.setLocationInstance(location);
	// 우측 On this Page 바로가기 데이터 세팅을 위한 호출.
	useHeadings();
	// 예시: 특정 경로에서 sidebar를 자동으로 닫거나 열기
	// 여기에 원하는 경로 패턴을 추가하세요
	const pathsToCollapse = [
		'/',
		'/main',
		// 추가로 sidebar를 닫고 싶은 경로를 여기에 추가
	];
	// 초기 상태를 pathname 기반으로 계산
	const [asidebarOpen, setAsidebarOpen] = useState<boolean>(true);
	// Sidebar 상태를 제어하기 위한 state
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

	//const [showHeader, setShowHeader] = useState<boolean>(isHeader);
	//const [showSidebar, setShowSidebar] = useState<boolean>(isSidebar);
	//const [showLNB, setShowLNB] = useState<boolean>(isLNB);
	//const [showFooter, setShowFooter] = useState<boolean>(isFooter);

	const [navData] = useState<any[]>(NAV_DATA);

	useEffect(() => {
		if (pathsToCollapse.some((path) => pathname === path)) {
			setSidebarOpen(false);
			setAsidebarOpen(false);
		} else {
			setSidebarOpen(true);
			setAsidebarOpen(true);
		}
	}, [pathname]);

	return (
		<>
			<div className="[--header-height:calc(--spacing(14))]">
				<SidebarProvider
					className="flex flex-col"
					open={sidebarOpen}
					onOpenChange={setSidebarOpen}
				>
					<SiteHeader />
					<div className="flex flex-1">
						<AppSidebar navData={navData} />
						<SidebarInset>
							<div className="flex">
								<div className=" flex-1 flex-col gap-4 p-6">
									{/* entec-next-assets-contents 클래스를 이용해서 내부 컨텐츠의 h2, h3 태그 찾는 aside 화면 로직 때문에 추가 */}
									<div className="entec-next-assets-contents min-h-screen flex-1 rounded-xl md:min-h-min">
										{children}
									</div>
								</div>
								{asidebarOpen ? <LayoutASide /> : null}
							</div>
						</SidebarInset>
					</div>
				</SidebarProvider>
			</div>
		</>
	);
};

LayoutMainIndex.displayName = 'LayoutMainIndex';
export default LayoutMainIndex;
