import type { IComponent } from '@/core/types/common';

import { Icons, type IconName } from './registry-icon';
import { type LucideProps } from 'lucide-react';

interface IIconDefaultProps extends LucideProps {
	name: IconName;
}

const IconDefault: IComponent<IIconDefaultProps> = ({ name, ...props }) => {
	const IconComponent = Icons[name] as any;

	// 유효한 아이콘 컴포넌트인지 확인하기
	if (!IconComponent || typeof IconComponent !== 'object') {
		console.warn(`[WARNING: entec-react-assets] "${String(name)}" is not a valid icon`);
		return null;
	}

	return <IconComponent {...props} />;
};

IconDefault.displayName = 'IconDefault';
export default IconDefault;
