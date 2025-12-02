import type { IComponent } from '@/core/types/common';

import { Button, buttonVariants } from '@/core/components/shadcn/ui/button';
import { type VariantProps } from 'class-variance-authority';

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

interface IButtonDefaultProps extends ButtonProps {
	children?: any;
}

const ButtonDefault: IComponent<IButtonDefaultProps> = ({ children, ...props }): React.ReactNode | any => {
	return <Button {...props}>{children}</Button>;
};

ButtonDefault.displayName = 'ButtonDefault';
export default ButtonDefault;
