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
import { Separator } from '@/core/components/shadcn/ui/separator';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
		items?: {
			type?: 'group' | 'item';
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
		if (menuNm.length > 1) {
			return String(menuNm[0]).toLocaleLowerCase() === path[2];
		} else {
			return title.toLocaleLowerCase() === path[2];
		}
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
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={activeDepth1(item.title)}
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
							</CollapsibleTrigger>
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
											{item.items?.map((subItem, subIndex) => {
												return (
													<div key={`${subItem.title}-${subIndex}`}>
														{subItem.type && subItem.type === 'group' ? (
															<>
																<Separator className={subIndex !== 0 ? 'mt-3' : ''} />
																<SidebarGroupLabel className="text-gray-400 h-[25px]">
																	{subItem.title}
																	{subItem.url}
																</SidebarGroupLabel>
																<Separator />
															</>
														) : (
															<SidebarMenuSubItem key={`${subItem.title}-${subIndex}`}>
																<SidebarMenuSubButton
																	isActive={activeMenu === subItem.url}
																	asChild
																>
																	{/*<a href={subItem.url}>
															<span>{subItem.title}</span>
														</a>*/}
																	<button
																		onClick={() => handlerNav(subItem.url)}
																		className="link-style w-full"
																	>
																		<span>{subItem.title}</span>
																	</button>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														)}
													</div>
												);
											})}
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
