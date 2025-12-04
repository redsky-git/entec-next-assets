'use client';

import type { IComponent } from '@/core/types/common';
import type { JSX } from 'react';

import { maskCardNumber } from '@domains/example/_common/card-utils';

interface IMaskedCardProps {
	test?: string;
}

const MaskedCard: IComponent<IMaskedCardProps> = (): JSX.Element => {
	const maskedCardNumber = maskCardNumber('1234567812345678');
	return (
		<>
			<div>
				<p>카드번호: {maskedCardNumber}</p>
			</div>
		</>
	);
};

MaskedCard.displayName = 'MaskedCard';
export default MaskedCard;
