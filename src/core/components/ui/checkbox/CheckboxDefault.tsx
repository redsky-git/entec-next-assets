import type { IComponent } from '@/core/types/common';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Checkbox } from '@/core/components/shadcn/ui/checkbox';

interface ICheckboxDefaultProps {
	//
}

const CheckboxDefault: IComponent<ICheckboxDefaultProps & React.ComponentProps<typeof CheckboxPrimitive.Root>> = ({
	...props
}) => {
	return <Checkbox {...props} />;
};

CheckboxDefault.displayName = 'CheckboxDefault';
export default CheckboxDefault;
