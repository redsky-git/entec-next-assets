import type { IComponent } from '@/core/types/common';

import { Accordion } from '@/core/components/shadcn/ui/accordion';
import type { AccordionSingleProps, AccordionMultipleProps } from '@radix-ui/react-accordion';
import { AccordionProvider } from './AccordionContext';
import { type IconName } from '@/core/components/ui/icon/registry-icon';

interface IAccordionDefaultProps {
	disableAnimation?: boolean;
	expandIcon?: IconName;
}

const AccordionDefault: IComponent<
	IAccordionDefaultProps & (AccordionSingleProps | AccordionMultipleProps) & React.RefAttributes<HTMLDivElement>
> = ({ disableAnimation = false, expandIcon, ...props }) => {
	return (
		<AccordionProvider value={{ disableAnimation, expandIcon }}>
			<Accordion {...props} />
		</AccordionProvider>
	);
};

AccordionDefault.displayName = 'AccordionDefault';
export default AccordionDefault;
