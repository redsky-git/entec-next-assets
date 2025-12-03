import type { IComponent } from '@/core/types/common';
import { useLayoutASide } from '@/shared/components/common/context/LayoutASideProvider';
import { Blinds } from 'lucide-react';

interface ILayoutASideProps {
	//headings: { id: string; text: string; level: number }[];
	//activeId?: string;
}

const LayoutASide: IComponent<ILayoutASideProps> = () => {
	const { headings, activeId } = useLayoutASide();

	const handlerOnThisPage = (id: string) => {
		const element = document.querySelector(`[data-section="${id}"]`);
		element?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	/*
	sm:  640px 이상
	md:  768px 이상
	lg:  1024px 이상
	xl:  1280px 이상
	2xl: 1536px 이상
	*/
	return (
		<aside className="hidden lg:block sticky top-20 w-64 h-fit">
			<div className="pl-4 border-l-2 border-gray-200">
				<h3 className="text-sm font-semibold text-gray-900 mb-4 inline-flex gap-1.5">
					<Blinds size={20} />
					On this page
				</h3>
				<nav className="space-y-2">
					{headings.map((heading) => (
						<button
							key={heading.id}
							onClick={() => handlerOnThisPage(heading.id)}
							className={`
                block text-sm transition-colors duration-200
                ${heading.level === 2 ? 'pl-0' : 'pl-4'}
                ${activeId === heading.id ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}
              `}
						>
							{heading.text}
						</button>
						// <a
						// 	key={heading.id}
						// 	href={`#${heading.id}`}
						// 	className={`
						//     block text-sm transition-colors duration-200
						//     ${heading.level === 2 ? 'pl-0' : 'pl-4'}
						//     ${activeId === heading.id ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}
						//   `}
						// >
						// 	{heading.text}
						// </a>
					))}
				</nav>
			</div>
		</aside>
	);
};

LayoutASide.displayName = 'LayoutASide';
export default LayoutASide;
