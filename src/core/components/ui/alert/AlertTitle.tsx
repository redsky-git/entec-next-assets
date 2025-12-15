import type { IComponent } from '@app-types/common';

import { AlertTitle as AlertTitlePrimitive } from '@/core/components/shadcn/ui/alert';

interface IAlertTitleProps {
	//
}

const AlertTitle: IComponent<IAlertTitleProps & React.ComponentProps<'div'>> = ({ ...props }) => {
	return <AlertTitlePrimitive {...props} />;
};

AlertTitle.displayName = 'AlertTitle';
export default AlertTitle;
