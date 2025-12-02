'use client';

import type { IComponent } from '@/core/types/common';
import { useState, type JSX } from 'react';

import { Card, CardContent } from '@/core/components/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/shadcn/ui/tabs';
import { Separator } from '@/core/components/shadcn/ui/separator';
import { Label } from '@/core/components/shadcn/ui/label';
import UICodeBlock from '@/shared/components/common/ui/UICodeBlock';
import { Input, Checkbox, Button } from '@/core/components/ui';

import { ArrowRight, Mail, User, EyeOff, Eye, Lock, CheckCircle2 } from 'lucide-react';

interface IJoinMemberExProps {
	test?: string;
}

const JoinMemberEx: IComponent<IJoinMemberExProps> = (): JSX.Element => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		agreeTerms: false,
	});
	const [passwordStrength, setPasswordStrength] = useState(0);

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const pwd = e.target.value;
		setFormData({ ...formData, password: pwd });

		// 비밀번호 강도 계산
		let strength = 0;
		if (pwd.length >= 8) strength++;
		if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
		if (/\d/.test(pwd)) strength++;
		if (/[^a-zA-Z\d]/.test(pwd)) strength++;
		setPasswordStrength(strength);
	};

	const getStrengthColor = () => {
		if (passwordStrength === 0) return 'bg-gray-200';
		if (passwordStrength === 1) return 'bg-red-500';
		if (passwordStrength === 2) return 'bg-yellow-500';
		if (passwordStrength === 3) return 'bg-blue-500';
		return 'bg-green-500';
	};

	const getStrengthText = () => {
		if (passwordStrength === 0) return '';
		if (passwordStrength === 1) return '약함';
		if (passwordStrength === 2) return '보통';
		if (passwordStrength === 3) return '좋음';
		return '강함';
	};

	const handleSubmit = () => {
		console.log('회원가입 데이터:', formData);
	};

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								회원가입 예제
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							<strong>entec-react-assets</strong> 에서 제공하는 <strong>Input, Checkbox, Button, Label</strong>{' '}
							컴포넌트를 활용한 회원가입 예제 화면입니다.
						</p>
					</div>
					<div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
						{/*<Alert>
							<AlertCircleIcon />
							<AlertTitle>업데이트 정보 :</AlertTitle>
							<AlertDescription>
								<p>Please verify your billing information and try again.</p>
								<ul className="list-inside list-disc text-sm">
									<li>Check your card details</li>
									<li>Ensure sufficient funds</li>
									<li>Verify billing address</li>
								</ul>
							</AlertDescription>
						</Alert>*/}
						<Separator className="my-6" />
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									회원가입 예제 화면
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								회원 가입이 꼭 필요한 업무 환경에서는 다음과 같은 회원가입 화면이 필수적입니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								상황에 따라 입력 받는 필드는 다를 수 있으나, 입력 받은 값을 서버로 보내고 회원 가입 여부 결과를 받는
								로직은 대체로 비슷합니다.
							</p>
						</div>
						<div className="w-full flex-1 py-4">
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<Card>
										<CardContent className="pt-5 pb-5 flex items-center justify-center">
											<div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 flex items-center justify-center p-4 relative overflow-hidden">
												{/* 배경 장식 요소 */}
												<div className="absolute inset-0 overflow-hidden pointer-events-none">
													<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
													<div
														className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
														style={{ animationDelay: '2s' }}
													></div>
													<div
														className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
														style={{ animationDelay: '4s' }}
													></div>
												</div>

												<div className="w-full max-w-md relative">
													{/* 메인 카드 */}
													<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-200/50 p-8 border border-white/20">
														{/* 헤더 */}
														<div className="text-center mb-8">
															<div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
																<User className="w-8 h-8 text-white" />
															</div>
															<h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
																회원가입
															</h1>
															<p className="text-gray-600">새로운 계정을 만들어보세요</p>
														</div>

														{/* 폼 */}
														<div className="space-y-5">
															{/* 이름 입력 */}
															<div className="space-y-2">
																<Label
																	htmlFor="name"
																	className="text-sm font-medium text-gray-700"
																>
																	이름
																</Label>
																<div className="relative">
																	<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
																	<Input
																		id="name"
																		type="text"
																		placeholder="홍길동"
																		value={formData.name}
																		onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
																		className="pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all"
																		required
																	/>
																</div>
															</div>

															{/* 이메일 입력 */}
															<div className="space-y-2">
																<Label
																	htmlFor="email"
																	className="text-sm font-medium text-gray-700"
																>
																	이메일
																</Label>
																<div className="relative">
																	<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
																	<Input
																		id="email"
																		type="email"
																		placeholder="example@email.com"
																		value={formData.email}
																		onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
																		className="pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all"
																		required
																	/>
																</div>
															</div>

															{/* 비밀번호 입력 */}
															<div className="space-y-2">
																<Label
																	htmlFor="password"
																	className="text-sm font-medium text-gray-700"
																>
																	비밀번호
																</Label>
																<div className="relative">
																	<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
																	<Input
																		id="password"
																		type={showPassword ? 'text' : 'password'}
																		placeholder="8자 이상 입력해주세요"
																		value={formData.password}
																		onChange={handlePasswordChange}
																		className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all"
																		required
																	/>
																	<button
																		type="button"
																		onClick={() => setShowPassword(!showPassword)}
																		className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
																	>
																		{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
																	</button>
																</div>
																{/* 비밀번호 강도 표시 */}
																{formData.password && (
																	<div className="space-y-1">
																		<div className="flex gap-1">
																			{[...Array(4)].map((_, i) => (
																				<div
																					key={i}
																					className={`h-1 flex-1 rounded-full transition-all ${
																						i < passwordStrength ? getStrengthColor() : 'bg-gray-200'
																					}`}
																				/>
																			))}
																		</div>
																		{passwordStrength > 0 && (
																			<p className="text-xs text-gray-600">비밀번호 강도: {getStrengthText()}</p>
																		)}
																	</div>
																)}
															</div>

															{/* 비밀번호 확인 */}
															<div className="space-y-2">
																<Label
																	htmlFor="confirmPassword"
																	className="text-sm font-medium text-gray-700"
																>
																	비밀번호 확인
																</Label>
																<div className="relative">
																	<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
																	<Input
																		id="confirmPassword"
																		type={showConfirmPassword ? 'text' : 'password'}
																		placeholder="비밀번호를 다시 입력해주세요"
																		value={formData.confirmPassword}
																		onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
																		className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all"
																		required
																	/>
																	<button
																		type="button"
																		onClick={() => setShowConfirmPassword(!showConfirmPassword)}
																		className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
																	>
																		{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
																	</button>
																</div>
																{formData.confirmPassword && formData.password !== formData.confirmPassword && (
																	<p className="text-xs text-red-500 flex items-center gap-1">
																		비밀번호가 일치하지 않습니다
																	</p>
																)}
																{formData.confirmPassword && formData.password === formData.confirmPassword && (
																	<p className="text-xs text-green-500 flex items-center gap-1">
																		<CheckCircle2 className="w-3 h-3" />
																		비밀번호가 일치합니다
																	</p>
																)}
															</div>

															{/* 약관 동의 */}
															<div className="flex items-start space-x-2 pt-2">
																<Checkbox
																	id="terms"
																	checked={formData.agreeTerms}
																	onCheckedChange={(checked: any) =>
																		setFormData({ ...formData, agreeTerms: checked as boolean })
																	}
																	className="mt-0.5"
																/>
																<label
																	htmlFor="terms"
																	className="text-sm text-gray-600 leading-relaxed cursor-pointer"
																>
																	<span className="font-medium text-blue-600">이용약관</span> 및{' '}
																	<span className="font-medium text-blue-600">개인정보처리방침</span>에 동의합니다
																</label>
															</div>

															{/* 가입 버튼 */}
															<Button
																onClick={handleSubmit}
																className="w-full h-12 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 group"
																disabled={!formData.agreeTerms || formData.password !== formData.confirmPassword}
															>
																가입하기
																<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
															</Button>
														</div>

														{/* 소셜 로그인 구분선 */}
														<div className="relative my-6">
															<div className="absolute inset-0 flex items-center">
																<div className="w-full border-t border-gray-200"></div>
															</div>
															<div className="relative flex justify-center text-sm">
																<span className="px-4 bg-white/80 text-gray-500">또는</span>
															</div>
														</div>

														{/* 소셜 로그인 버튼 */}
														<div className="grid grid-cols-2 gap-3">
															<Button
																type="button"
																variant="outline"
																className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
															>
																<svg
																	className="w-5 h-5 mr-2"
																	viewBox="0 0 24 24"
																>
																	<path
																		fill="#4285F4"
																		d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
																	/>
																	<path
																		fill="#34A853"
																		d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
																	/>
																	<path
																		fill="#FBBC05"
																		d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
																	/>
																	<path
																		fill="#EA4335"
																		d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
																	/>
																</svg>
																Google
															</Button>
															<Button
																type="button"
																variant="outline"
																className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
															>
																<svg
																	className="w-5 h-5 mr-2"
																	fill="#03C75A"
																	viewBox="0 0 24 24"
																>
																	<path d="M13.06 10.24c-.13-.01-.25-.01-.39-.01-2.41 0-4.37 1.96-4.37 4.37 0 2.41 1.96 4.37 4.37 4.37 2.04 0 3.75-1.4 4.22-3.29h-4.22v-2.66h6.98c.07.38.1.77.1 1.18 0 4.42-3.58 7.56-7.08 7.56-4.14 0-7.5-3.36-7.5-7.5s3.36-7.5 7.5-7.5c1.99 0 3.8.78 5.15 2.05l-2.09 2.09c-.77-.74-1.79-1.19-2.91-1.19-2.41 0-4.37 1.96-4.37 4.37 0 .14 0 .27.01.39z" />
																</svg>
																Naver
															</Button>
														</div>

														{/* 로그인 링크 */}
														<p className="text-center text-sm text-gray-600 mt-6">
															이미 계정이 있으신가요?{' '}
															<a
																href="#"
																className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
															>
																로그인
															</a>
														</p>
													</div>

													{/* 하단 텍스트 */}
													<p className="text-center text-xs text-gray-500 mt-6">
														가입하시면 서비스 약관 및 개인정보 보호정책에 동의하는 것으로 간주됩니다
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card>
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`<Card>
	<CardHeader>
		<CardTitle>직원 정보 등록</CardTitle>
		<CardDescription>새로운 직원 정보를 입력해주세요</CardDescription>
	</CardHeader>
	<CardContent className="space-y-6">
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-2">
				<Label
					htmlFor="name"
					className="after:content-['*'] after:text-red-500"
				>
					이름
				</Label>
				<Input
					id="name"
					placeholder="홍길동"
				/>
			</div>
			<div className="space-y-2">
				<Label
					htmlFor="email"
					className="after:content-['*'] after:text-red-500"
				>
					이메일
				</Label>
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						id="email"
						type="email"
						placeholder="example@company.com"
						className="pl-10"
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="phone">전화번호</Label>
				<div className="relative">
					<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						id="phone"
						placeholder="010-1234-5678"
						className="pl-10"
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label
					htmlFor="department"
					className="after:content-['*'] after:text-red-500"
				>
					부서
				</Label>
				<Select>
					<SelectTrigger id="department">
						<SelectValue placeholder="부서 선택" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="dev">개발팀</SelectItem>
						<SelectItem value="design">디자인팀</SelectItem>
						<SelectItem value="marketing">마케팅팀</SelectItem>
						<SelectItem value="hr">인사팀</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="position">직급</Label>
				<Select>
					<SelectTrigger id="position">
						<SelectValue placeholder="직급 선택" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="intern">인턴</SelectItem>
						<SelectItem value="junior">주니어</SelectItem>
						<SelectItem value="senior">시니어</SelectItem>
						<SelectItem value="lead">리드</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="joinDate">입사일</Label>
				<Input
					id="joinDate"
					type="date"
				/>
			</div>
		</div>

		<div className="space-y-2">
			<Label htmlFor="bio">소개</Label>
			<Textarea
				id="bio"
				placeholder="간단한 자기소개를 입력해주세요"
				rows={4}
			/>
		</div>

		<div className="flex items-center space-x-2">
			<Checkbox id="terms" />
			<Label
				htmlFor="terms"
				className="text-sm text-slate-600"
			>
				개인정보 수집 및 이용에 동의합니다
			</Label>
		</div>

		<Alert>
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>안내</AlertTitle>
			<AlertDescription className="flex">
				<span className="text-red-500 text-sm">*</span>표시된 항목은 필수 입력 항목입니다.
			</AlertDescription>
		</Alert>
	</CardContent>
	<CardFooter className="flex justify-end gap-2">
		<Button variant="outline">취소</Button>
		<Button>등록하기</Button>
	</CardFooter>
</Card>`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
					</div>
				</div>
			</div>
		</>
	);
};

JoinMemberEx.displayName = 'JoinMemberEx';
export default JoinMemberEx;
