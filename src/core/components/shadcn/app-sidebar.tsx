import * as React from 'react';
import Image from 'next/image';
import { Frame, LifeBuoy, Map, PieChart, Send } from 'lucide-react';

import { NavMain } from './nav-main';
//import { NavProjects } from '@/app/components/shadcn/nav-projects';
//import { NavSecondary } from '@/app/components/shadcn/nav-secondary';
import { NavUser } from './nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from './ui/sidebar';

export function AppSidebar({ navData, ...props }: React.ComponentProps<typeof Sidebar> | any) {
	const [data, setData] = React.useState({
		user: {
			name: 'ITCEN ENTEC',
			email: 'm@itcen.com',
			avatar: '/avatars/shadcn.jpg',
		},
		navMain: [],
		navSecondary: [
			{
				title: 'Support',
				url: '#',
				icon: LifeBuoy,
			},
			{
				title: 'Feedback',
				url: '#',
				icon: Send,
			},
		],
		projects: [
			{
				name: 'Design Engineering',
				url: '#',
				icon: Frame,
			},
			{
				name: 'Sales & Marketing',
				url: '#',
				icon: PieChart,
			},
			{
				name: 'Travel',
				url: '#',
				icon: Map,
			},
		],
	});

	React.useEffect(() => {
		if (navData && Array.isArray(navData)) {
			setData({ ...data, navMain: navData as any });
		}
	}, []);

	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
						>
							<a href="#">
								<div className="bg-sidebar-custom text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									{/*<CodeXml className="size-4" />*/}

									<Image
										src="/era_logo.png"
										alt="ERA Logo"
										width={32}
										height={32}
										className="size-8"
									/>
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">ITCEN ENTEC</span>
									<span className="truncate text-xs">entec-next-assets</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/*<NavProjects projects={data.projects} />*/}
				{/*<NavSecondary
					items={data.navSecondary}
					className="mt-auto"
				/>*/}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
