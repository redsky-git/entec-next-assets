'use client';

import { SidebarIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SearchForm } from '@/core/components/shadcn/search-form';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/core/components/shadcn/ui/breadcrumb';
import { Button } from '@/core/components/shadcn/ui/button';
import { Separator } from '@/core/components/shadcn/ui/separator';
import { useSidebar } from '@/core/components/shadcn/ui/sidebar';

export function SiteHeader() {
	const pathname = usePathname();
	const { toggleSidebar } = useSidebar();

	return (
		<header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
			<div className="flex h-(--header-height) w-full items-center gap-2 px-4">
				<Button
					className="h-8 w-8"
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
				>
					<SidebarIcon />
				</Button>
				<Separator
					orientation="vertical"
					className="mr-2 h-4"
				/>
				<Breadcrumb className="hidden sm:block">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Entec Next Assets</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{pathname}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<SearchForm className="w-full sm:ml-auto sm:w-auto" />
			</div>
		</header>
	);
}
