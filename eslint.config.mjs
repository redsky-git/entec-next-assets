import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),
	{
		// 커스텀 규칙 추가
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'jsx-quotes': ['error', 'prefer-double'],
			semi: ['error', 'always'],
			'@typescript-eslint/no-empty-object-type': 'off',
			'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
			'react-hooks/exhaustive-deps': 'off',
			// "no-unused-vars": "warn", 옵션은 사용되지 않는 변수에 대해 eslint가 경고를 표시하도록 설정합니다.
			// TypeScript를 사용할 때는 "@typescript-eslint/no-unused-vars"를 대신 사용하는 것이 더 좋습니다.
			//"no-unused-vars": "warn",
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
]);

export default eslintConfig;
