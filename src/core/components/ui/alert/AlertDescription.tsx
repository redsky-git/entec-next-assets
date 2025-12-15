import type { IComponent } from '@app-types/common';

import { AlertDescription as AlertDescriptionPrimitive } from '@/core/components/shadcn/ui/alert';

interface IAlertDescriptionProps {
	//
}

const AlertDescription: IComponent<IAlertDescriptionProps & React.ComponentProps<'div'>> = ({ ...props }) => {
	return <AlertDescriptionPrimitive {...props} />;
};

AlertDescription.displayName = 'AlertDescription';
export default AlertDescription;
