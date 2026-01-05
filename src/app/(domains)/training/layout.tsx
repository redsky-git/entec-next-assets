import type { IComponent } from '@/core/types/common';
import type { ReactNode } from 'react';

interface ITrainingLayoutProps {
	children: ReactNode;
}

const TrainingLayout: IComponent<ITrainingLayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen border-4 border-indigo-600 dark:border-indigo-500">
			{/* Training 헤더 */}
			<div className="border-b-4 border-indigo-600 bg-indigo-50 px-6 py-4 dark:border-indigo-500 dark:bg-indigo-950">
				<h1 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">🎓 Layout Zone</h1>
			</div>

			{/* Training 컨텐츠 */}
			<div className="p-6">{children}</div>
		</div>
	);
};

TrainingLayout.displayName = 'TrainingLayout';
export default TrainingLayout;
