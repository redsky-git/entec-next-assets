'use client';

import { useState } from 'react';
import { serverApi } from '@fetch/server-api';
import { Button } from '@components/shadcn/ui/button';
import { Input } from '@components/shadcn/ui/input';
import { Label } from '@components/shadcn/ui/label';
import { Textarea } from '@components/shadcn/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@components/shadcn/ui/card';
import { Loader2 } from 'lucide-react';

interface IPostResponse {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	UserId: number;
}

export default function ServerApiForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState<IPostResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setResponse(null);
		setError(null);

		const formData = new FormData(event.currentTarget);

		// FormData 내용 확인 (디버깅용)
		// console.log('FormData entries:', Object.fromEntries(formData));

		try {
			// serverApi 호출 (Server Action)
			// Next.js Server Action에서는 FormData를 직접 전달할 수 있습니다.
			// serverApi 내부의 fetch가 FormData를 감지하여 자동으로 Content-Type: multipart/form-data를 설정합니다.
			const res = await serverApi<IPostResponse>('https://koreanjson.com/posts', {
				method: 'POST',
				body: formData,
				cache: 'no-store',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			console.log('[https://koreanjson.com/posts] response:', res);
			console.log('[https://koreanjson.com/posts] error:', res.message);
			if (res.data) {
				setResponse(res.data);
			} else if (res.error) {
				setError(res.error);
			}
		} catch (err) {
			console.error('API Error:', err);
			setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>게시글 작성 (FormData)</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="title">제목</Label>
							<Input
								id="title"
								name="title"
								placeholder="제목을 입력하세요"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="content">내용</Label>
							<Textarea
								id="content"
								name="content"
								placeholder="내용을 입력하세요"
								required
								className="min-h-[120px]"
							/>
						</div>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									전송 중...
								</>
							) : (
								'ServerApi로 전송'
							)}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>응답 결과</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="bg-muted min-h-[300px] rounded-md p-4 overflow-auto">
						{response ? (
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600">✅ 전송 성공!</h4>
								<pre className="text-sm border rounded bg-background p-2 overflow-x-auto">
									{JSON.stringify(response, null, 2)}
								</pre>
							</div>
						) : error ? (
							<div className="space-y-2">
								<h4 className="font-semibold text-red-600">❌ 전송 실패</h4>
								<p className="text-sm">{error}</p>
							</div>
						) : (
							<div className="flex h-full items-center justify-center text-muted-foreground text-sm">
								왼쪽 폼을 작성하고 전송하면
								<br />
								결과가 여기에 표시됩니다.
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
