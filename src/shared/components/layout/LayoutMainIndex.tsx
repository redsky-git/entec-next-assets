'use client';

import type { IComponent } from '@/core/types/common';

//import { Outlet, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';

import { NAV_DATA } from '@/shared/constants/nav-data';

import { AppSidebar } from '@/core/components/shadcn/app-sidebar';
import { SiteHeader } from '@/core/components/shadcn/site-header';
import { SidebarInset, SidebarProvider } from '@/core/components/shadcn/ui/sidebar';

//import LayoutASide from './LayoutASide';
//import { useHeadings } from '@/app/hooks/layout/use-headings';

interface ILayoutMainIndexProps {
	message?: string;
	subMessage?: string;
	children: React.ReactNode;
}

const LayoutMainIndex: IComponent<ILayoutMainIndexProps> = ({ children }) => {
	//const navigate = useNavigate();
	//const location = useLocation();
	//$router.setNaviInstance(navigate);
	//$router.setLocationInstance(location);
	// 우측 On this Page 바로가기 데이터 세팅을 위한 호출.
	//useHeadings();
	const [asidebarOpen, setAsidebarOpen] = useState<boolean>(true);
	// Sidebar 상태를 제어하기 위한 state
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

	//const [showHeader, setShowHeader] = useState<boolean>(isHeader);
	//const [showSidebar, setShowSidebar] = useState<boolean>(isSidebar);
	//const [showLNB, setShowLNB] = useState<boolean>(isLNB);
	//const [showFooter, setShowFooter] = useState<boolean>(isFooter);

	const [navData] = useState<any[]>(NAV_DATA);

	// 특정 경로에서 sidebar 상태를 변경하는 로직
	//useEffect(() => {
	//	// 예시: 특정 경로에서 sidebar를 자동으로 닫거나 열기
	//	// 여기에 원하는 경로 패턴을 추가하세요
	//	const pathsToCollapse = [
	//		'/',
	//		// 추가로 sidebar를 닫고 싶은 경로를 여기에 추가
	//	];

	//	const currentPath = location.pathname;

	//	// 경로가 pathsToCollapse에 포함되어 있으면 sidebar 닫기
	//	if (pathsToCollapse.some((path) => currentPath === path)) {
	//		setSidebarOpen(false);
	//		setAsidebarOpen(false);
	//	}
	//	// 경로가 pathsToExpand에 포함되어 있으면 sidebar 열기
	//	else {
	//		setSidebarOpen(true);
	//		setAsidebarOpen(true);
	//	}
	//}, [location.pathname]);

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
								{/*{asidebarOpen ? <LayoutASide /> : null}*/}
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
