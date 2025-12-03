import type { IComponent } from '@/core/types/common';

import { AccordionItem as AccordionItemPrimitive } from '@/core/components/shadcn/ui/accordion';
import type { AccordionItemProps } from '@radix-ui/react-accordion';

interface IAccordionItemProps extends AccordionItemProps {
	//className: string;
}

const AccordionItem: IComponent<IAccordionItemProps & React.RefAttributes<HTMLDivElement>> = ({
	...props
}): React.ReactNode => {
	return <AccordionItemPrimitive {...props} />;
};

AccordionItem.displayName = 'AccordionItem';
export default AccordionItem;
