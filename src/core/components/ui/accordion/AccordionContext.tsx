import { createContext } from 'react';
import { type IconName } from '@/core/components/ui/icon/registry-icon';

interface AccordionContextValue {
	disableAnimation?: boolean;
	expandIcon?: IconName;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);
export const AccordionProvider = AccordionContext.Provider;

export default AccordionContext;
