import type { IComponent } from '@/core/types/common';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/core/components/shadcn/lib/utils';
import type { AccordionTriggerProps } from '@radix-ui/react-accordion';
import { type IconName } from '@/core/components/ui/icon/registry-icon';
import { Icon } from '@/core/components/ui';
import { useAccordionContext } from '@/core/hooks';

interface IAccordionTriggerProps extends AccordionTriggerProps {
	className?: string;
	expandIcon?: IconName;
	disableAnimation?: boolean;
}

const AccordionTrigger: IComponent<
	IAccordionTriggerProps & React.ComponentProps<typeof AccordionPrimitive.Trigger>
> = ({ children, className, expandIcon, disableAnimation, ...props }): React.ReactNode => {
	const context = useAccordionContext();
	// 개별 prop이 우선, 없으면 Context 값 사용
	const shouldDisableAnimation = disableAnimation ?? context?.disableAnimation ?? false;
	// expandIcon이 우선, 없으면 Context 값 사용
	const iconName = expandIcon ?? context?.expandIcon ?? 'ChevronDownIcon';

	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					className,
				)}
				{...props}
			>
				{children}
				<Icon
					name={iconName}
					className={cn(
						'text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5',
						!shouldDisableAnimation && 'transition-transform duration-200',
					)}
				/>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
};

AccordionTrigger.displayName = 'AccordionTrigger';
export default AccordionTrigger;
