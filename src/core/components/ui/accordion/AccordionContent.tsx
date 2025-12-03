import type { IComponent } from '@/core/types/common';

import type { AccordionContentProps } from '@radix-ui/react-accordion';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/core/components/shadcn/lib/utils';
import { useAccordionContext } from '@/core/hooks';

interface IAccordionContentProps extends AccordionContentProps {
	className?: string;
	children: React.ReactNode;
	disableAnimation?: boolean;
}

const AccordionContent: IComponent<IAccordionContentProps & React.RefAttributes<HTMLDivElement>> = ({
	className = '',
	children = '',
	disableAnimation,
	...props
}): React.ComponentProps<typeof AccordionPrimitive.Content> => {
	const context = useAccordionContext();
	// 개별 prop이 우선, 없으면 Context 값 사용
	const shouldDisableAnimation = disableAnimation ?? context?.disableAnimation ?? false;

	return (
		<AccordionPrimitive.Content
			data-slot="accordion-content"
			className={cn(
				'overflow-hidden text-sm',
				!shouldDisableAnimation && 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
				className,
			)}
			{...props}
		>
			<div className={cn('pt-0 pb-4')}>{children}</div>
		</AccordionPrimitive.Content>
	);
};

AccordionContent.displayName = 'AccordionContent';
export default AccordionContent;
