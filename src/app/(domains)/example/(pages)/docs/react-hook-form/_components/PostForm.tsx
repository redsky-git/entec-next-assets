'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { PostFormSchema, type PostFormData } from '../_schemas/post.schema';
import { createPostAction } from '../postsAction';

// shadcn/ui Form 컴포넌트
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/core/components/shadcn/ui/form';
import { Input } from '@/core/components/shadcn/ui/input';
import { Button } from '@/core/components/shadcn/ui/button';
import { Textarea } from '@/core/components/shadcn/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/shadcn/ui/select';
import { Checkbox } from '@/core/components/shadcn/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@components/ui';
import { Icon } from '@components/ui';

export default function PostForm() {
	// Server Action 상태 관리
	const [state, formAction, isPending] = useActionState(createPostAction, null);

	// react-hook-form 설정
	const form = useForm<PostFormData>({
		resolver: zodResolver(PostFormSchema),
		defaultValues: {
			title: '',
			body: '',
			email: '',
			category: undefined,
			agree: false,
		},
	});

	// 서버 측 검증 에러를 클라이언트 폼에 반영
	useEffect(() => {
		if (state && !state.success && state.errors) {
			Object.entries(state.errors).forEach(([field, messages]) => {
				if (Array.isArray(messages) && messages.length > 0) {
					form.setError(field as keyof PostFormData, {
						type: 'server',
						message: messages[0],
					});
				}
			});
		}
	}, [state, form]);

	// 폼 제출 핸들러
	const onSubmit = async (data: PostFormData) => {
		console.log('Form submitted:', data);

		// FormData 생성
		const formData = new FormData();
		formData.append('title', data.title);
		formData.append('body', data.body);
		formData.append('email', data.email || '');
		formData.append('category', data.category);
		formData.append('agree', String(data.agree));

		// Server Action 호출
		formAction(formData);
	};

	return (
		<div className="w-full max-w-2xl mx-auto">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					{/* 제목 필드 */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									제목 <span className="text-red-600">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="게시글 제목을 입력하세요"
										{...field}
										disabled={isPending}
									/>
								</FormControl>
								<FormDescription>2자 이상, 100자 이하로 입력해주세요.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* 내용 필드 */}
					<FormField
						control={form.control}
						name="body"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									내용 <span className="text-red-600">*</span>
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="게시글 내용을 입력하세요"
										className="min-h-[120px] resize-none"
										{...field}
										disabled={isPending}
									/>
								</FormControl>
								<FormDescription>10자 이상, 1000자 이하로 입력해주세요.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* 이메일 필드 (선택) */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>이메일 (선택)</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="example@email.com"
										{...field}
										disabled={isPending}
									/>
								</FormControl>
								<FormDescription>답변을 받을 이메일을 입력하세요.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* 카테고리 선택 */}
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									카테고리 <span className="text-red-600">*</span>
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isPending}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="카테고리를 선택하세요" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="general">일반</SelectItem>
										<SelectItem value="tech">기술</SelectItem>
										<SelectItem value="news">뉴스</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>게시글의 카테고리를 선택해주세요.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* 약관 동의 체크박스 */}
					<FormField
						control={form.control}
						name="agree"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isPending}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>
										약관에 동의합니다 <span className="text-red-600">*</span>
									</FormLabel>
									<FormDescription>개인정보 처리방침 및 이용약관에 동의합니다.</FormDescription>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* 제출 버튼 */}
					<Button
						type="submit"
						className="w-full"
						disabled={isPending}
					>
						{isPending ? (
							<>
								<span className="mr-2">⏳</span>
								전송 중...
							</>
						) : (
							'게시글 작성'
						)}
					</Button>
				</form>
			</Form>

			{/* 결과 표시 */}
			{state && (
				<div className="mt-6">
					{state.success ? (
						<Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
							<Icon
								name="CheckCircle"
								className="text-green-600 dark:text-green-400"
							/>
							<AlertTitle className="text-green-900 dark:text-green-100">성공!</AlertTitle>
							<AlertDescription className="text-green-800 dark:text-green-200">
								<p className="mb-2">{state.message}</p>
								<pre className="text-xs bg-green-100 dark:bg-green-900 rounded p-2 overflow-auto">
									{JSON.stringify(state.data, null, 2)}
								</pre>
							</AlertDescription>
						</Alert>
					) : (
						<Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
							<Icon
								name="AlertCircle"
								className="text-red-600 dark:text-red-400"
							/>
							<AlertTitle className="text-red-900 dark:text-red-100">오류 발생</AlertTitle>
							<AlertDescription className="text-red-800 dark:text-red-200">{state.message}</AlertDescription>
						</Alert>
					)}
				</div>
			)}
		</div>
	);
}
