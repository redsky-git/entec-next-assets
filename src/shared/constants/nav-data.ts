//import { BookOpen, FileSliders, Settings2, Component, LayoutTemplate } from 'lucide-react';
import { BookOpen, NotebookText, FileSliders, Component, LayoutTemplate } from 'lucide-react';

export const NAV_DATA: any = [
	{
		title: 'Components',
		url: '#',
		icon: Component,
		isActive: false,
		items: [
			{
				title: 'Accordion',
				url: '/example/components/accordion',
			},
			{
				title: 'Alert',
				url: '/example/components/alert',
			},
			{
				title: 'Alert Dialog',
				url: '/example/components/alert-dialog',
			},
			{
				title: 'Badge',
				url: '/example/components/badge',
			},
			{
				title: 'Button',
				url: '/example/components/button',
			},
			{
				title: 'Calendar',
				url: '/example/components/calendar',
			},
			{
				title: 'Checkbox',
				url: '/example/components/checkbox',
			},
			{
				title: 'Confirm Dialog',
				url: '/example/components/confirm-dialog',
			},
			{
				title: 'Dialog',
				url: '/example/components/dialog',
			},
			{
				title: 'Icon',
				url: '/example/components/icon',
			},
			{
				title: 'Select',
				url: '/example/components/select',
			},
			{
				title: 'Spinner',
				url: '/example/components/spinner',
			},
			{
				title: 'Table',
				url: '/example/components/table',
			},
		],
	},
	{
		title: 'API Usage',
		url: '#',
		icon: FileSliders,
		isActive: false,
		items: [
			{
				title: '◉ $router',
				type: 'group',
			},
			{
				title: '$router.goBack()',
				url: '/example/api/router-goback',
			},
			{
				title: '$router.push()',
				url: '/example/api/router-push',
			},
			{
				title: '◉ $ui',
				type: 'group',
			},
			{
				title: '$ui.alert()',
				url: '/example/api/ui-alert-dialog-ex',
			},
			{
				title: '$ui.confirm()',
				url: '/example/api/ui-confirm-dialog-ex',
			},
			{
				title: '◉ $util',
				type: 'group',
			},
			{
				title: '$util.date',
				url: '/example/api/util-date-ex',
			},
			{
				title: '$util.format',
				url: '/example/api/util-format-ex',
			},
			{
				title: '$util.string',
				url: '/example/api/util-string-ex',
			},
			{
				title: '◉ Hooks',
				type: 'group',
			},
			{
				title: 'useAPI',
				url: '/example/api/use-api-ex',
			},
			{
				title: 'useReduxAPI',
				url: '/example/api/use-redux-api-ex',
			},
			{
				title: '◉ Test',
				type: 'group',
			},
			{
				title: 'call API',
				url: '/example/api/call-api',
			},
			{
				title: 'call API client',
				url: '/example/api/call-api-client',
			},
		],
	},
	{
		title: 'Specific examples',
		url: '#',
		icon: LayoutTemplate,
		isActive: false,
		items: [
			{
				title: '상세 입력 폼',
				url: '/example/specific/form-detail',
			},
			{
				title: '회원가입',
				url: '/example/specific/join-member',
			},
			{
				title: 'Table 활용',
				url: '/example/specific/table-util',
			},
			{
				title: '대시보드',
				url: '/example/specific/dashboard',
			},
		],
	},
	{
		title: 'Docs examples',
		url: '#',
		icon: NotebookText,
		isActive: false,
		items: [
			{
				title: '업무 공통 함수',
				url: '/example/docs/common',
			},
		],
	},
	{
		title: 'Documentation',
		url: 'http://redsky0212.dothome.co.kr/entec/react_assets/guide/',
		icon: BookOpen,
		isActive: false,
		items: [],
	},
	//{
	//	title: 'Settings',
	//	url: '#',
	//	icon: Settings2,
	//	isActive: false,
	//	items: [],
	//},
];
