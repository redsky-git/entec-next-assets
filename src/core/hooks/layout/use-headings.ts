import { useEffect, useRef } from 'react';
import { useLayoutASide, type HeadingItem } from '@/shared/components/common/context/LayoutASideProvider';

export const useHeadings = () => {
	const { headings: headingsOrg, setHeadings, activeId: activeIdOrg, setActiveId } = useLayoutASide();
	const headingElements = useRef<any>(null);
	const observer = useRef<any>(null);

	const getHeading = () => {
		// h2, h3 요소들을 찾아서 ID 생성 및 저장
		const parentElement = document.querySelector('.entec-next-assets-contents');
		headingElements.current = parentElement?.querySelectorAll('h2[data-shorcut], h3[data-shorcut]');
		const headings: HeadingItem[] = [];

		headingElements.current?.forEach((heading: any, index: number) => {
			const level = heading.tagName === 'H2' ? 2 : 3;
			let id = heading.id;

			// ID가 없으면 생성
			if (!id) {
				id = `heading-${index}`;
				heading.id = id;
				heading.setAttribute('data-section', id);
			}

			headings.push({
				id,
				text: heading.textContent || '',
				level: level as 2 | 3,
			});
		});

		setHeadings(headings);

		// IntersectionObserver 설정
		observer.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{
				rootMargin: '-80px 0px -80% 0px', // 헤더 높이 고려
				threshold: 0,
			},
		);

		// 모든 heading 요소 관찰
		headingElements.current?.forEach((heading: any) => {
			observer.current.observe(heading);
		});
	};

	useEffect(() => {
		setTimeout(() => {
			headingElements.current = null;
			observer.current = null;
			getHeading();
		}, 100);

		// 클린업
		return () => {
			headingElements.current?.forEach((heading: any) => {
				observer.current.unobserve(heading);
			});
			headingElements.current = null;
			observer.current = null;
		};
	}, [headingsOrg, setHeadings, setActiveId, activeIdOrg]);
};
