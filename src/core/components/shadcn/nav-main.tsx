'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/core/components/shadcn/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/core/components/shadcn/ui/sidebar';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const router = useRouter();
	const activeMenu = usePathname();
	// url에 http, https가 있는지 찾는 함수
	const findExternalUrl = useCallback((url: string) => {
		return url.includes('http://') || url.includes('https://');
	}, []);

	// nav 클릭, 화면이동
	const handlerNav = (url: string) => {
		//setActiveMenu(url);
		if (findExternalUrl(url)) {
			window.open(url, '_blank', 'noopener,noreferrer');
		} else {
			router.push(url);
		}
	};

	//const activeDepth1 = (title: string) => {
	//	const path = activeMenu.split('/');
	//	const menuNm = title.split(' ');
	//	console.log(path);
	//	console.log(menuNm);
	//	if (menuNm.length > 1) {
	//		return String(menuNm[0]).toLocaleLowerCase() === path[2];
	//	} else {
	//		return title.toLocaleLowerCase() === path[2];
	//	}
	//};
	const activeDepth1 = (title: string) => {
		const path = activeMenu.split('/');
		const menuNm = title.split(' ');
		console.log(activeMenu, path);
		console.log(title, menuNm);
		//if (menuNm.length > 0) {
	};

	const collapsibleDepth1 = (menu: any) => {
		const subMenu = menu.items;
		for (let i = 0; i < subMenu.length; i++) {
			if (subMenu[i].url === activeMenu) {
				return true;
			}
		}
		return menu.isActive;
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Example</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item, index) => (
					<Collapsible
						key={`${item.title}-${index}`}
						asChild
						defaultOpen={collapsibleDepth1(item)}
					>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive
							>
								<button
									onClick={() => handlerNav(item.url)}
									className="link-style"
									key={index}
								>
									<item.icon />
									<span>{item.title}</span>
								</button>
							</SidebarMenuButton>
							{item.items?.length ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuAction className="data-[state=open]:rotate-90">
											<ChevronRight />
											<span className="sr-only">Toggle</span>
										</SidebarMenuAction>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem, subIndex) => (
												<SidebarMenuSubItem key={`${subItem.title}-${subIndex}`}>
													<SidebarMenuSubButton
														isActive={activeMenu === subItem.url}
														asChild
													>
														<button
															onClick={() => handlerNav(subItem.url)}
															className="link-style w-full"
														>
															<span>{subItem.title}</span>
														</button>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : null}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
