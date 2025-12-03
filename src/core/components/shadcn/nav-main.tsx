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

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Example</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item, index) => (
					<Collapsible
						key={`${item.title}-${index}`}
						asChild
						defaultOpen={item.isActive}
					>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
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
