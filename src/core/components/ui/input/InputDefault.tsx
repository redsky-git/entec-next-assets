import type { IComponent } from '@/core/types/common';

import { Input } from '@/core/components/shadcn/ui/input';

interface IInputDefaultProps {
	className?: string;
}

const InputDefault: IComponent<IInputDefaultProps & React.ComponentProps<'input'>> = ({ className = '', ...props }) => {
	return (
		<Input
			className={className}
			{...props}
		/>
	);
};

InputDefault.displayName = 'InputDefault';
export default InputDefault;
