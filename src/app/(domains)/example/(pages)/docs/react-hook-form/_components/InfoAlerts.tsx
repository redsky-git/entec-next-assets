'use client';

import { Alert, AlertDescription, AlertTitle, Icon } from '@components/ui';

export function InfoAlerts() {
	return (
		<>
			{/* 핵심 특징 Alert */}
			<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
				<Icon
					name="Lightbulb"
					className="text-blue-600 dark:text-blue-400"
				/>
				<AlertTitle className="text-blue-900 dark:text-blue-100">이 패턴의 핵심 특징</AlertTitle>
				<AlertDescription className="text-blue-800 dark:text-blue-200">
					<ul className="list-disc list-inside text-sm space-y-1">
						<li>
							<strong>타입 안전성:</strong> Zod 스키마에서 TypeScript 타입 자동 생성
						</li>
						<li>
							<strong>클라이언트 검증:</strong> react-hook-form + Zod로 실시간 유효성 검사
						</li>
						<li>
							<strong>서버 검증:</strong> Server Action에서 동일한 Zod 스키마로 재검증 (보안)
						</li>
						<li>
							<strong>shadcn/ui 통합:</strong> Form 컴포넌트로 일관된 UI/UX 제공
						</li>
						<li>
							<strong>에러 처리:</strong> 서버 측 에러를 클라이언트 폼에 자동 반영
						</li>
					</ul>
				</AlertDescription>
			</Alert>
		</>
	);
}

export function FeatureAlerts() {
	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Alert className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
				<Icon
					name="CheckCircle"
					className="text-purple-600 dark:text-purple-400"
				/>
				<AlertTitle className="text-purple-900 dark:text-purple-100">실시간 유효성 검사</AlertTitle>
				<AlertDescription className="text-purple-800 dark:text-purple-200">
					입력하는 즉시 Zod 스키마로 검증하여 에러를 표시합니다.
				</AlertDescription>
			</Alert>

			<Alert className="border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950">
				<Icon
					name="Shield"
					className="text-indigo-600 dark:text-indigo-400"
				/>
				<AlertTitle className="text-indigo-900 dark:text-indigo-100">이중 검증</AlertTitle>
				<AlertDescription className="text-indigo-800 dark:text-indigo-200">
					클라이언트와 서버 양쪽에서 동일한 스키마로 검증하여 보안을 강화합니다.
				</AlertDescription>
			</Alert>

			<Alert className="border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950">
				<Icon
					name="Code"
					className="text-cyan-600 dark:text-cyan-400"
				/>
				<AlertTitle className="text-cyan-900 dark:text-cyan-100">타입 안전성</AlertTitle>
				<AlertDescription className="text-cyan-800 dark:text-cyan-200">
					Zod 스키마에서 TypeScript 타입이 자동으로 생성되어 타입 에러를 사전에 방지합니다.
				</AlertDescription>
			</Alert>

			<Alert className="border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950">
				<Icon
					name="Palette"
					className="text-teal-600 dark:text-teal-400"
				/>
				<AlertTitle className="text-teal-900 dark:text-teal-100">shadcn/ui 통합</AlertTitle>
				<AlertDescription className="text-teal-800 dark:text-teal-200">
					Form 컴포넌트로 일관된 디자인과 접근성을 제공합니다.
				</AlertDescription>
			</Alert>
		</div>
	);
}
