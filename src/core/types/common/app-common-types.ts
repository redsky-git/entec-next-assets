import React from 'react';

export type TComponent<P = object> = (props: P) => React.ReactElement | any;
export interface IComponent<P = object> {
	(props: P): React.ReactElement | React.ReactNode | any;
	displayName?: string | undefined;
}
