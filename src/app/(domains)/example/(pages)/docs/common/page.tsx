'use client';

import type { IComponent } from '@/core/types/common';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { Card, CardContent } from '@/core/components/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/shadcn/ui/tabs';
import { Separator } from '@/core/components/shadcn/ui/separator';

import UICodeBlock from '@/shared/components/common/ui/UICodeBlock';

//import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/core/components/ui';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui';

import { maskCardNumber } from '@domains/example/_common/card-utils';

interface ICommonBizFuncExProps {
	test?: string;
}

const CommonBizFuncEx: IComponent<ICommonBizFuncExProps> = (): JSX.Element => {
	const [value, setValue] = useState('item-1');
	const maskedCardNumber = maskCardNumber('1234567812345678');
	// useEffect hooks
	useEffect(() => {
		// ...
	}, []);

	return (
		<>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full  min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between">
							<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
								업무 공통 함수 사용 예제
							</h1>
							<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
								&nbsp;
							</div>
						</div>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							domain 업무 공간 내에서 작업을 하다 보면 <strong>각각의 업무 영역에서만</strong> 사용되는 JavaScript 공통
							함수가 필요한 경우가 발생할 수 있습니다. 이러한 경우, 다음과 같이 공통 함수를 생성하여 활용할 수 있습니다.
						</p>
						<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
							여러가지 방법으로 공통함수를 제공할 수 있지만 여기서는 일반적인 <strong>Function</strong> 방식과{' '}
							<strong>class</strong> 방식 두가지로 알려드립니다.
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
									업무(domain)별 공통함수 만들기
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base pb-4">
								<strong>Accordion</strong> 컴포넌트는{' '}
								<strong>Accordion, AccordionContent, AccordionItem, AccordionTrigger</strong> 이렇게 4가지 컴포넌트로
								구성되어 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base pb-4">
								이 네 가지를 조합하여 하나 이상의 섹션을 자유롭게 만들 수 있으며, 각 <strong>AccordionItem</strong>에는{' '}
								<strong>AccordionTrigger</strong>와 <strong>AccordionContent</strong>를 배치하여 토글 기능과 내용을
								구현합니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base pb-4">
								기본적으로 <strong>type="single"</strong> 속성을 사용하면 한 번에 한 섹션만 펼칠 수 있고,{' '}
								<strong>type="multiple"</strong>을 주면 여러 섹션이 동시에 펼쳐지는 등 유연한 설정이 가능합니다.
								<br />
								또한 <strong>collapsible</strong> 옵션을 추가하면 열려 있는 항목을 다시 클릭해서 모두 닫을 수도
								있습니다.
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
											<div>
												<p>카드번호: {maskedCardNumber}</p>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div>
			<Accordion
				type="single"
				collapsible
				className="w-full"
				defaultValue="item-1"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>제품 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
							탁월한 성능과 안정성을 제공합니다.
						</p>
						<p>
							주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
							인터페이스가 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>배송 세부 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
							영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
						</p>
						<p>
							모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
							실시간으로 배송 상황을 확인하실 수 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									Single 타입
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트는 단일 선택 모드인 <strong>Single</strong> 타입을 제공합니다. 이
								모드에서는 한 번에 하나의 섹션만 확장할 수 있어, 사용자가 특정 정보에 집중할 수 있도록 도와줍니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Single</strong> 타입은 특히 제한된 공간에서 여러 섹션을 제공해야 할 때 유용하며, 예제는 위{' '}
								<strong>Basic Accordion</strong> 예제와 같습니다.
							</p>
						</div>
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									Multiple 타입
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트는 다중 선택 모드인 <strong>Multiple</strong> 타입도 제공합니다. 이
								모드에서는 사용자가 여러 섹션을 동시에 확장할 수 있어, 다양한 정보를 한눈에 확인하고자 할 때 유용합니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Multiple</strong> 타입은 정보가 풍부한 대시보드나 설정 페이지에서 특히 효과적이며, 예제는 아래와
								같습니다.
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
											<Accordion
												type="multiple"
												className="w-full"
												defaultValue={['item-1']}
											>
												<AccordionItem value="item-1">
													<AccordionTrigger>제품 정보</AccordionTrigger>
													<AccordionContent className="flex flex-col gap-4 text-balance">
														<p>
															저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
															탁월한 성능과 안정성을 제공합니다.
														</p>
														<p>
															주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
															인터페이스가 있습니다.
														</p>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-2">
													<AccordionTrigger>배송 세부 정보</AccordionTrigger>
													<AccordionContent className="flex flex-col gap-4 text-balance">
														<p>
															저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
															영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
														</p>
														<p>
															모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
															실시간으로 배송 상황을 확인하실 수 있습니다.
														</p>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div>
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={['item-1']}
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>제품 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
							탁월한 성능과 안정성을 제공합니다.
						</p>
						<p>
							주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
							인터페이스가 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>배송 세부 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
							영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
						</p>
						<p>
							모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
							실시간으로 배송 상황을 확인하실 수 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									아이콘 변경
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트의 <strong>expandIcon prop</strong>을 사용하여{' '}
								<strong>확장 표시</strong> 아이콘을 전체적으로 변경할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionTrigger</strong> 컴포넌트의 <strong>expandIcon prop</strong>을 사용하여{' '}
								<strong>확장 표시</strong> 아이콘을 개별적으로 변경할 수 있습니다.
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
											<Accordion
												type="multiple"
												className="w-full"
												defaultValue={['item-1']}
											>
												<AccordionItem value="item-1">
													<AccordionTrigger expandIcon="SquareArrowDown">제품 정보</AccordionTrigger>
													<AccordionContent className="flex flex-col gap-4 text-balance">
														<p>
															저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
															탁월한 성능과 안정성을 제공합니다.
														</p>
														<p>
															주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
															인터페이스가 있습니다.
														</p>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-2">
													<AccordionTrigger expandIcon="SquareArrowDown">배송 세부 정보</AccordionTrigger>
													<AccordionContent className="flex flex-col gap-4 text-balance">
														<p>
															저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
															영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
														</p>
														<p>
															모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
															실시간으로 배송 상황을 확인하실 수 있습니다.
														</p>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div>
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={['item-1']}
				expandIcon="SquareArrowDown" // 전체적으로 확장 표시 아이콘 변경
			>
				<AccordionItem value="item-1">
					<AccordionTrigger expandIcon="SquareArrowDown">제품 정보</AccordionTrigger> // 개별적으로 확장 표시 아이콘 변경
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
							탁월한 성능과 안정성을 제공합니다.
						</p>
						<p>
							주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
							인터페이스가 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger expandIcon="SquareArrowDown">배송 세부 정보</AccordionTrigger> // 개별적으로 확장 표시 아이콘 변경
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
							영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
						</p>
						<p>
							모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
							실시간으로 배송 상황을 확인하실 수 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									Disabled 처리
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트나 <strong>AccordionItem</strong> 컴포넌트의{' '}
								<strong>disabled</strong> 속성을 사용하여 비활성화 처리할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트에 <strong>disabled</strong> 속성을 추가하면 모든 섹션이 비활성화
								됩니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionItem</strong> 컴포넌트에 <strong>disabled</strong> 속성을 추가하면 해당 섹션이 비활성화
								됩니다.
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
											<div className="flex flex-col md:flex-row w-full gap-6">
												<div className="flex-1 flex flex-col gap-2">
													<label htmlFor="message-2">Accordion Disabled 처리</label>
													<Accordion
														type="multiple"
														className="w-full"
														defaultValue={['item-1']}
														disabled
													>
														<AccordionItem value="item-1">
															<AccordionTrigger>제품 정보</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																<p>
																	저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
																	제작되어 탁월한 성능과 안정성을 제공합니다.
																</p>
																<p>
																	주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
																	인터페이스가 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
														<AccordionItem value="item-2">
															<AccordionTrigger>배송 세부 정보</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																<p>
																	저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
																	영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
																</p>
																<p>
																	모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
																	실시간으로 배송 상황을 확인하실 수 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</div>
												<div className="flex-1 flex flex-col gap-2">
													<label htmlFor="message-2">첫번째 AccordionItem Disabled 처리</label>
													<Accordion
														type="multiple"
														className="w-full"
														defaultValue={['item-1']}
													>
														<AccordionItem
															value="item-1"
															disabled
														>
															<AccordionTrigger>제품 정보</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																<p>
																	저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
																	제작되어 탁월한 성능과 안정성을 제공합니다.
																</p>
																<p>
																	주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
																	인터페이스가 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
														<AccordionItem value="item-2">
															<AccordionTrigger>배송 세부 정보</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																<p>
																	저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
																	영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
																</p>
																<p>
																	모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
																	실시간으로 배송 상황을 확인하실 수 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div className="flex flex-col md:flex-row w-full gap-6">
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">Accordion Disabled 처리</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
					disabled
				>
					<AccordionItem value="item-1">
						<AccordionTrigger>제품 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">첫번째 AccordionItem Disabled 처리</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
				>
					<AccordionItem
						value="item-1"
						disabled
					>
						<AccordionTrigger>제품 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									animation 처리
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트는 기본적으로 애니메이션 효과가 적용되어 있습니다.{' '}
								<strong>Accordion</strong> 컴포넌트의 전체 섹션 애니메이션 효과를 비활성화하려면{' '}
								<strong>disableAnimation</strong> 속성을 사용하면 됩니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionContent</strong> 컴포넌트의 <strong>disableAnimation</strong> 속성을 사용하면 해당
								섹션의 애니메이션 효과를 비활성화할 수 있습니다. 이 속성은 개별적으로 설정할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>AccordionTrigger</strong> 컴포넌트의 <strong>disableAnimation</strong> 속성을 사용하면 해당
								섹션의 헤더 부분의 아이콘 애니메이션 효과를 비활성화할 수 있습니다.
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
											<div className="flex flex-col md:flex-row w-full gap-6">
												<div className="flex-1 flex flex-col gap-2">
													<label htmlFor="message-2">Accordion animation 비활성화 처리</label>
													<Accordion
														type="multiple"
														className="w-full"
														defaultValue={['item-1']}
														disableAnimation
													>
														<AccordionItem value="item-1">
															<AccordionTrigger>제품 정보</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																<p>
																	저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
																	제작되어 탁월한 성능과 안정성을 제공합니다.
																</p>
																<p>
																	주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
																	인터페이스가 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
														<AccordionItem value="item-2">
															<AccordionTrigger>배송 세부 정보</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																<p>
																	저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
																	영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
																</p>
																<p>
																	모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
																	실시간으로 배송 상황을 확인하실 수 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</div>
												<div className="flex-1 flex flex-col gap-2">
													<label htmlFor="message-2">
														첫번째 AccordionTrigger, AccordionContent만 animation 비활성화 처리
													</label>
													<Accordion
														type="multiple"
														className="w-full"
														defaultValue={['item-1']}
													>
														<AccordionItem value="item-1">
															<AccordionTrigger disableAnimation>제품 정보</AccordionTrigger>
															<AccordionContent
																disableAnimation
																className="flex flex-col gap-4 text-balance"
															>
																<p>
																	저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
																	제작되어 탁월한 성능과 안정성을 제공합니다.
																</p>
																<p>
																	주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
																	인터페이스가 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
														<AccordionItem value="item-2">
															<AccordionTrigger>배송 세부 정보</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																<p>
																	저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
																	영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
																</p>
																<p>
																	모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
																	실시간으로 배송 상황을 확인하실 수 있습니다.
																</p>
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	return (
		<div className="flex flex-col md:flex-row w-full gap-6">
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">Accordion animation 비활성화 처리</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
					disableAnimation
				>
					<AccordionItem value="item-1">
						<AccordionTrigger>제품 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<div className="flex-1 flex flex-col gap-2">
				<label htmlFor="message-2">
					첫번째 AccordionTrigger, AccordionContent만 animation 비활성화 처리
				</label>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={['item-1']}
				>
					<AccordionItem value="item-1">
						<AccordionTrigger disableAnimation>제품 정보</AccordionTrigger>
						<AccordionContent
							disableAnimation
							className="flex flex-col gap-4 text-balance"
						>
							<p>
								저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
								제작되어 탁월한 성능과 안정성을 제공합니다.
							</p>
							<p>
								주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
								인터페이스가 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>배송 세부 정보</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<p>
								저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
								영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
							</p>
							<p>
								모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
								실시간으로 배송 상황을 확인하실 수 있습니다.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}
						{/* example 블럭요서 START */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									상태 관리 (value, onValueChange)
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>Accordion</strong> 컴포넌트의 <strong>value</strong>와 <strong>onValueChange</strong> 속성을
								사용하여 상태를 관리할 수 있습니다.
							</p>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								<strong>value</strong> 속성은 현재 열려있는 아코디언 항목의 고유값을 나타내며,{' '}
								<strong>onValueChange</strong> 속성은 아코디언 항목이 열리거나 닫힐 때 호출되는 콜백 이벤트 함수입니다.
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
											<div className="flex-1 flex flex-col gap-2">
												<label htmlFor="message-2">
													현재 선택된 value상태 값 : <strong style={{ color: 'blue' }}>{value}</strong>
												</label>
												<Accordion
													type="single"
													collapsible
													className="w-full"
													value={value}
													onValueChange={setValue}
												>
													<AccordionItem value="item-1">
														<AccordionTrigger>제품 정보</AccordionTrigger>
														<AccordionContent className="flex flex-col gap-4 text-balance">
															<p>
																저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로 제작되어
																탁월한 성능과 안정성을 제공합니다.
															</p>
															<p>
																주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
																인터페이스가 있습니다.
															</p>
														</AccordionContent>
													</AccordionItem>
													<AccordionItem value="item-2">
														<AccordionTrigger>배송 세부 정보</AccordionTrigger>
														<AccordionContent className="flex flex-col gap-4 text-balance">
															<p>
																저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
																영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
															</p>
															<p>
																모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
																실시간으로 배송 상황을 확인하실 수 있습니다.
															</p>
														</AccordionContent>
													</AccordionItem>
												</Accordion>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="SamplePage.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function SamplePage() {
	const [value, setValue] = useState('item-1');

	return (
		<div className="flex-1 flex flex-col gap-2">
			<label htmlFor="message-2">현재 선택된 value상태 값 : {value}</label>
			<Accordion
				type="single"
				collapsible
				className="w-full"
				value={value}
				onValueChange={setValue}
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>제품 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희의 주력 제품은 최첨단 기술과 세련된 디자인이 결합되었습니다. 최고급 소재로
							제작되어 탁월한 성능과 안정성을 제공합니다.
						</p>
						<p>
							주요 특징으로는 고급 처리 기능과 초보자와 전문가 모두를 위해 설계된 직관적인 사용자
							인터페이스가 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>배송 세부 정보</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							저희는 신뢰할 수 있는 택배 파트너를 통해 전 세계 배송 서비스를 제공합니다. 일반 배송은
							영업일 기준 3~5일이 소요되며, 특급 배송은 영업일 기준 1~2일 이내에 배송됩니다.
						</p>
						<p>
							모든 주문은 꼼꼼하게 포장되고 완벽하게 보험 처리됩니다. 저희 전용 추적 포털을 통해
							실시간으로 배송 상황을 확인하실 수 있습니다.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* example 블럭요서 END */}

						{/* 금융권 실무 예제 START */}
						<Separator className="my-8" />
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h2
									data-shorcut="true"
									className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-3xl xl:text-3xl"
								>
									실전 예제
								</h2>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base pb-4">
								<strong>Accordion</strong> 컴포넌트를 활용한 UI 예제들입니다. 거래 내역, 약관 동의, 포트폴리오 등 다양한
								화면에서 활용 가능합니다.
							</p>
						</div>

						{/* 예제 1: 거래 내역 상세 */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									1. 거래 내역 상세
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								거래 내역 목록에서 각 거래를 클릭하면 상세 정보를 확인할 수 있습니다. 입출금, 이체, 카드결제 등 다양한
								거래 유형의 상세 정보를 효율적으로 표시할 수 있습니다.
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
										<CardContent className="pt-5 pb-5">
											<div className="mb-4">
												<h4 className="text-lg font-semibold mb-2">최근 거래 내역</h4>
												<p className="text-sm text-muted-foreground">2025년 11월</p>
											</div>
											<Separator className="my-1" />
											<Accordion
												type="single"
												collapsible
												className="w-full"
											>
												<AccordionItem value="item-1">
													<AccordionTrigger>
														<div className="flex justify-between items-center w-full pr-4">
															<div className="flex flex-col items-start gap-1">
																<span className="font-medium">스타벅스 강남점</span>
																<span className="text-sm text-muted-foreground">2025.11.26 10:23</span>
															</div>
															<span className="font-semibold text-red-600">-5,500원</span>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
															<div className="flex justify-between">
																<span className="text-muted-foreground">거래 유형</span>
																<span className="font-medium">카드 결제</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">카드번호</span>
																<span className="font-medium">신한 **** **** 1234</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">승인번호</span>
																<span className="font-medium">12345678</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">잔액</span>
																<span className="font-medium">1,245,500원</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">가맹점 주소</span>
																<span className="font-medium text-right">서울 강남구 테헤란로 123</span>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-2">
													<AccordionTrigger>
														<div className="flex justify-between items-center w-full pr-4">
															<div className="flex flex-col items-start gap-1">
																<span className="font-medium">홍길동님에게 송금</span>
																<span className="text-sm text-muted-foreground">2025.11.25 14:15</span>
															</div>
															<span className="font-semibold text-red-600">-100,000원</span>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
															<div className="flex justify-between">
																<span className="text-muted-foreground">거래 유형</span>
																<span className="font-medium">계좌 이체</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">받는 분</span>
																<span className="font-medium">홍길동</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">받는 계좌</span>
																<span className="font-medium">국민 123-45-678901</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">수수료</span>
																<span className="font-medium">0원 (타행 무료)</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">잔액</span>
																<span className="font-medium">1,251,000원</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">메모</span>
																<span className="font-medium">생일 축하금</span>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-3">
													<AccordionTrigger>
														<div className="flex justify-between items-center w-full pr-4">
															<div className="flex flex-col items-start gap-1">
																<span className="font-medium">급여 입금</span>
																<span className="text-sm text-muted-foreground">2025.11.25 09:00</span>
															</div>
															<span className="font-semibold text-blue-600">+3,500,000원</span>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
															<div className="flex justify-between">
																<span className="text-muted-foreground">거래 유형</span>
																<span className="font-medium">급여 이체</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">보낸 곳</span>
																<span className="font-medium">(주)엔텍</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">보낸 계좌</span>
																<span className="font-medium">기업 987-654-321098</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">잔액</span>
																<span className="font-medium">4,851,000원</span>
															</div>
															<div className="flex justify-between">
																<span className="text-muted-foreground">입금 월</span>
																<span className="font-medium">2025년 11월분</span>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="TransactionHistory.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function TransactionHistory() {
	return (
		<div>
			<div className="mb-4">
				<h4 className="text-lg font-semibold mb-2">최근 거래 내역</h4>
				<p className="text-sm text-muted-foreground">2025년 11월</p>
			</div>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<div className="flex justify-between items-center w-full pr-4">
							<div className="flex flex-col items-start gap-1">
								<span className="font-medium">스타벅스 강남점</span>
								<span className="text-sm text-muted-foreground">2025.11.26 10:23</span>
							</div>
							<span className="font-semibold text-red-600">-5,500원</span>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
							<div className="flex justify-between">
								<span className="text-muted-foreground">거래 유형</span>
								<span className="font-medium">카드 결제</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">카드번호</span>
								<span className="font-medium">신한 **** **** 1234</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">승인번호</span>
								<span className="font-medium">12345678</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">잔액</span>
								<span className="font-medium">1,245,500원</span>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
				{/* 추가 거래 내역... */}
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>

						{/* 예제 2: 약관 동의 */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									2. 약관 동의
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								금융 서비스 가입 시 필요한 약관들을 펼쳐서 확인하고 동의할 수 있습니다. 필수/선택 약관을 구분하여
								표시하고, 각 약관의 전문을 확인할 수 있습니다.
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
										<CardContent className="pt-5 pb-5">
											<div className="mb-4">
												<h4 className="text-lg font-semibold mb-2">계좌 개설 약관 동의</h4>
												<p className="text-sm text-muted-foreground">약관을 확인하시고 동의해 주세요</p>
											</div>
											<Accordion
												type="multiple"
												className="w-full"
											>
												<AccordionItem value="item-1">
													<AccordionTrigger>
														<div className="flex items-center gap-3 w-full pr-4">
															<input
																type="checkbox"
																className="w-4 h-4"
																onClick={(e) => e.stopPropagation()}
															/>
															<span className="font-medium">[필수] 금융거래 이용약관</span>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="p-4 bg-muted/50 rounded-lg">
															<div className="h-48 overflow-y-auto text-sm space-y-3 border border-border rounded p-3 bg-background">
																<h5 className="font-semibold">제1조 (목적)</h5>
																<p className="text-muted-foreground">
																	본 약관은 은행(이하 "은행"이라 합니다)과 거래처(이하 "거래자"라 합니다) 사이의 모든
																	금융거래에 관한 기본적이고 공통적인 사항을 정함으로써 신의에 따라 성실하게 거래를
																	이행하고 거래의 원활한 진행을 확보하는 것을 목적으로 합니다.
																</p>
																<h5 className="font-semibold">제2조 (거래의 개시)</h5>
																<p className="text-muted-foreground">
																	① 거래자는 은행이 정하는 절차에 따라 거래계좌를 개설하여야 합니다.
																	<br />② 거래자가 거래계좌를 개설할 때에는 실명법에서 정하는 실명확인증표를 제시하고
																	거래계좌를 개설하여야 하며, 실명법 등에 의하여 필요한 사항을 신고하여야 합니다.
																</p>
																<h5 className="font-semibold">제3조 (거래의 제한)</h5>
																<p className="text-muted-foreground">
																	은행은 거래자의 거래행위가 법령, 건전한 거래질서 또는 사회상규에 반하는 경우 또는
																	그러한 거래행위에 이용될 우려가 있는 경우에는 거래자의 거래를 제한할 수 있습니다.
																</p>
																<h5 className="font-semibold">제4조 (거래의 안전성 확보)</h5>
																<p className="text-muted-foreground">
																	① 거래자는 은행이 제공하는 보안매체 및 보안수단을 사용하여 거래의 안전성을 확보하여야
																	합니다.
																	<br />② 거래자는 비밀번호 등 거래수단을 제3자에게 누설하거나 노출하여서는 아니되며,
																	이를 위반하여 발생한 손해는 거래자가 부담합니다.
																</p>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-2">
													<AccordionTrigger>
														<div className="flex items-center gap-3 w-full pr-4">
															<input
																type="checkbox"
																className="w-4 h-4"
																onClick={(e) => e.stopPropagation()}
															/>
															<span className="font-medium">[필수] 전자금융거래 이용약관</span>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="p-4 bg-muted/50 rounded-lg">
															<div className="h-48 overflow-y-auto text-sm space-y-3 border border-border rounded p-3 bg-background">
																<h5 className="font-semibold">제1조 (목적)</h5>
																<p className="text-muted-foreground">
																	이 약관은 은행과 이용자 사이의 전자금융거래에 관한 기본적인 사항을 정함으로써
																	전자금융거래의 안전성과 신뢰성을 확보하고 전자금융거래의 건전한 발전을 위함을 목적으로
																	합니다.
																</p>
																<h5 className="font-semibold">제2조 (용어의 정의)</h5>
																<p className="text-muted-foreground">
																	① "전자금융거래"라 함은 은행이 전자적 장치를 통하여 제공하는 금융상품 및 서비스를
																	이용자가 전자적 장치를 통하여 비대면·자동화된 방식으로 직접 이용하는 거래를 말합니다.
																	<br />② "접근매체"라 함은 전자금융거래에 있어서 거래지시를 하거나 이용자 및 거래내용의
																	진실성과 정확성을 확보하기 위하여 사용되는 수단 또는 정보로서 전자식 카드 및 이에
																	준하는 전자적 정보를 말합니다.
																</p>
																<h5 className="font-semibold">제3조 (접근매체의 관리)</h5>
																<p className="text-muted-foreground">
																	① 은행은 접근매체의 발급 주체에 따라 접근매체를 은행발급 접근매체와 이용자 선택·지정
																	접근매체로 구분하여 관리합니다.
																	<br />② 이용자는 접근매체를 제3자에게 대여하거나 그 사용을 위임하거나 양도 또는 담보
																	목적으로 제공하여서는 안됩니다.
																</p>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-3">
													<AccordionTrigger>
														<div className="flex items-center gap-3 w-full pr-4">
															<input
																type="checkbox"
																className="w-4 h-4"
																onClick={(e) => e.stopPropagation()}
															/>
															<span className="font-medium">[필수] 개인정보 수집·이용 동의</span>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="p-4 bg-muted/50 rounded-lg">
															<div className="h-48 overflow-y-auto text-sm space-y-3 border border-border rounded p-3 bg-background">
																<h5 className="font-semibold">1. 개인정보의 수집·이용 목적</h5>
																<p className="text-muted-foreground">
																	은행은 수집한 개인정보를 다음의 목적을 위해 활용합니다.
																	<br />- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
																	<br />- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정이용
																	방지와 비인가 사용 방지, 가입 의사 확인
																</p>
																<h5 className="font-semibold">2. 수집하는 개인정보 항목</h5>
																<p className="text-muted-foreground">
																	필수항목: 성명, 생년월일, 성별, 주소, 연락처(전화번호, 휴대폰번호), 이메일, 직업, 국적
																	<br />
																	선택항목: 직장명, 직장주소, 결혼여부, 취미
																</p>
																<h5 className="font-semibold">3. 개인정보의 보유 및 이용기간</h5>
																<p className="text-muted-foreground">
																	이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이
																	파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
																	<br />- 보존 항목: 거래기록
																	<br />- 보존 근거: 전자금융거래법
																	<br />- 보존 기간: 5년
																</p>
																<h5 className="font-semibold">4. 동의를 거부할 권리 및 동의 거부에 따른 불이익</h5>
																<p className="text-muted-foreground">
																	이용자는 개인정보의 수집·이용에 대한 동의를 거부할 수 있습니다. 다만, 필수 항목에 대한
																	동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.
																</p>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-4">
													<AccordionTrigger>
														<div className="flex items-center gap-3 w-full pr-4">
															<input
																type="checkbox"
																className="w-4 h-4"
																onClick={(e) => e.stopPropagation()}
															/>
															<span className="font-medium">[선택] 마케팅 정보 수신 동의</span>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="p-4 bg-muted/50 rounded-lg">
															<div className="h-48 overflow-y-auto text-sm space-y-3 border border-border rounded p-3 bg-background">
																<h5 className="font-semibold">1. 마케팅 정보 수신 동의</h5>
																<p className="text-muted-foreground">
																	은행은 고객님의 동의를 받아 다음과 같은 마케팅 활동에 개인정보를 이용합니다.
																	<br />- 신규 서비스(상품) 개발 및 맞춤 서비스 제공
																	<br />- 이벤트 및 광고성 정보 제공 및 참여기회 제공
																	<br />- 인구통계학적 특성에 따른 서비스 제공 및 광고 게재
																</p>
																<h5 className="font-semibold">2. 수신 방법</h5>
																<p className="text-muted-foreground">
																	SMS, 이메일, 전화, 우편, 앱 푸시 알림 등의 방법으로 마케팅 정보를 수신할 수 있습니다.
																</p>
																<h5 className="font-semibold">3. 철회 방법</h5>
																<p className="text-muted-foreground">
																	고객님은 마케팅 정보 수신 동의를 언제든지 철회할 수 있습니다.
																	<br />- 고객센터(1588-xxxx)를 통한 철회
																	<br />- 모바일 앱 설정 메뉴를 통한 철회
																	<br />- 수신한 이메일/문자의 수신거부 링크를 통한 철회
																</p>
																<h5 className="font-semibold">4. 동의 거부 시</h5>
																<p className="text-muted-foreground">
																	마케팅 정보 수신에 동의하지 않으셔도 은행의 금융 서비스를 이용하실 수 있습니다. 다만,
																	각종 이벤트 및 프로모션 안내를 받으실 수 없습니다.
																</p>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
											<div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
												<p className="text-sm text-blue-800 dark:text-blue-200">
													※ 필수 약관에 모두 동의하셔야 계좌 개설이 가능합니다.
												</p>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="TermsAgreement.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function TermsAgreement() {
	return (
		<div>
			<div className="mb-4">
				<h4 className="text-lg font-semibold mb-2">계좌 개설 약관 동의</h4>
				<p className="text-sm text-muted-foreground">약관을 확인하시고 동의해 주세요</p>
			</div>
			<Accordion type="multiple" className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<div className="flex items-center gap-3 w-full pr-4">
							<input
								type="checkbox"
								className="w-4 h-4"
								onClick={(e) => e.stopPropagation()}
							/>
							<span className="font-medium">[필수] 금융거래 이용약관</span>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="p-4 bg-muted/50 rounded-lg">
							<div className="h-48 overflow-y-auto text-sm space-y-3 border rounded p-3">
								<h5 className="font-semibold">제1조 (목적)</h5>
								<p className="text-muted-foreground">
									본 약관은 은행과 거래자 사이의 모든 금융거래에 관한
									기본적이고 공통적인 사항을 정함으로써...
								</p>
								{/* 약관 내용... */}
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
				{/* 추가 약관... */}
			</Accordion>
			<div className="mt-6 p-4 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-800">
					※ 필수 약관에 모두 동의하셔야 계좌 개설이 가능합니다.
				</p>
			</div>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>

						{/* 예제 3: 포트폴리오 자산 현황 */}
						<div className="flex flex-col gap-2 pt-6">
							<div className="flex items-start justify-between">
								<h3
									data-shorcut="true"
									className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-2xl xl:text-2xl"
								>
									3. 포트폴리오 / 자산 현황
								</h3>
								<div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
									&nbsp;
								</div>
							</div>
							<p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
								투자 포트폴리오나 보유 자산을 카테고리별로 구분하여 표시할 수 있습니다. 예금, 주식, 펀드, 부동산 등 자산
								유형별 상세 현황을 한눈에 파악할 수 있습니다.
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
										<CardContent className="pt-5 pb-5">
											<div className="mb-4">
												<h4 className="text-lg font-semibold mb-2">내 자산 현황</h4>
												<div className="flex items-baseline gap-2">
													<span className="text-3xl font-bold">45,782,500원</span>
													<span className="text-sm text-muted-foreground">총 자산</span>
												</div>
											</div>
											<Accordion
												type="single"
												collapsible
												className="w-full"
											>
												<AccordionItem value="item-1">
													<AccordionTrigger>
														<div className="flex justify-between items-center w-full pr-4">
															<div className="flex flex-col items-start gap-1">
																<span className="font-semibold">예금/적금</span>
																<span className="text-sm text-muted-foreground">3개 상품</span>
															</div>
															<div className="flex flex-col items-end gap-1">
																<span className="text-lg font-bold">25,000,000원</span>
																<span className="text-xs text-green-600">+150,000원 (이자)</span>
															</div>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">S-정기예금</p>
																	<p className="text-sm text-muted-foreground">신한은행 | 연 3.5%</p>
																	<p className="text-xs text-muted-foreground mt-1">만기일: 2025.12.31 (35일 남음)</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">10,000,000원</p>
																	<p className="text-sm text-green-600">+85,000원</p>
																</div>
															</div>
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">자유적금</p>
																	<p className="text-sm text-muted-foreground">국민은행 | 연 3.0%</p>
																	<p className="text-xs text-muted-foreground mt-1">만기일: 2026.06.30 (217일 남음)</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">8,000,000원</p>
																	<p className="text-sm text-green-600">+45,000원</p>
																</div>
															</div>
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">청년도약계좌</p>
																	<p className="text-sm text-muted-foreground">우리은행 | 연 4.5%</p>
																	<p className="text-xs text-muted-foreground mt-1">만기일: 2028.11.26 (1095일 남음)</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">7,000,000원</p>
																	<p className="text-sm text-green-600">+20,000원</p>
																</div>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-2">
													<AccordionTrigger>
														<div className="flex justify-between items-center w-full pr-4">
															<div className="flex flex-col items-start gap-1">
																<span className="font-semibold">주식</span>
																<span className="text-sm text-muted-foreground">5개 종목</span>
															</div>
															<div className="flex flex-col items-end gap-1">
																<span className="text-lg font-bold">12,500,000원</span>
																<span className="text-xs text-red-600">-350,000원 (-2.72%)</span>
															</div>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">삼성전자</p>
																	<p className="text-sm text-muted-foreground">100주 | 평균 70,000원</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">7,200,000원</p>
																	<p className="text-sm text-green-600">+200,000원 (+2.86%)</p>
																</div>
															</div>
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">SK하이닉스</p>
																	<p className="text-sm text-muted-foreground">30주 | 평균 140,000원</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">3,900,000원</p>
																	<p className="text-sm text-red-600">-300,000원 (-7.14%)</p>
																</div>
															</div>
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">카카오</p>
																	<p className="text-sm text-muted-foreground">25주 | 평균 48,000원</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">1,150,000원</p>
																	<p className="text-sm text-red-600">-50,000원 (-4.17%)</p>
																</div>
															</div>
															<div className="text-center pt-2">
																<button className="text-sm text-blue-600 hover:underline">+ 2개 종목 더보기</button>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-3">
													<AccordionTrigger>
														<div className="flex justify-between items-center w-full pr-4">
															<div className="flex flex-col items-start gap-1">
																<span className="font-semibold">펀드</span>
																<span className="text-sm text-muted-foreground">2개 상품</span>
															</div>
															<div className="flex flex-col items-end gap-1">
																<span className="text-lg font-bold">5,800,000원</span>
																<span className="text-xs text-green-600">+180,000원 (+3.20%)</span>
															</div>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">글로벌 AI 테크 펀드</p>
																	<p className="text-sm text-muted-foreground">미래에셋자산운용 | 주식형</p>
																	<p className="text-xs text-muted-foreground mt-1">
																		수익률: +5.8% | 가입일: 2024.06.15
																	</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">3,500,000원</p>
																	<p className="text-sm text-green-600">+190,000원</p>
																</div>
															</div>
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">배당 성장 펀드</p>
																	<p className="text-sm text-muted-foreground">삼성자산운용 | 혼합형</p>
																	<p className="text-xs text-muted-foreground mt-1">
																		수익률: -0.4% | 가입일: 2024.09.01
																	</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">2,300,000원</p>
																	<p className="text-sm text-red-600">-10,000원</p>
																</div>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
												<AccordionItem value="item-4">
													<AccordionTrigger>
														<div className="flex justify-between items-center w-full pr-4">
															<div className="flex flex-col items-start gap-1">
																<span className="font-semibold">보험</span>
																<span className="text-sm text-muted-foreground">2개 상품</span>
															</div>
															<div className="flex flex-col items-end gap-1">
																<span className="text-lg font-bold">2,482,500원</span>
																<span className="text-xs text-muted-foreground">해약 환급금</span>
															</div>
														</div>
													</AccordionTrigger>
													<AccordionContent>
														<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">종신보험</p>
																	<p className="text-sm text-muted-foreground">삼성생명 | 월 150,000원 납입</p>
																	<p className="text-xs text-muted-foreground mt-1">
																		가입일: 2020.03.01 | 납입 68개월/240개월
																	</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">1,580,000원</p>
																	<p className="text-xs text-muted-foreground">해약환급금</p>
																</div>
															</div>
															<div className="flex justify-between items-center p-3 bg-background rounded border">
																<div>
																	<p className="font-medium">건강보험</p>
																	<p className="text-sm text-muted-foreground">한화생명 | 월 80,000원 납입</p>
																	<p className="text-xs text-muted-foreground mt-1">
																		가입일: 2022.01.15 | 납입 34개월/120개월
																	</p>
																</div>
																<div className="text-right">
																	<p className="font-semibold">902,500원</p>
																	<p className="text-xs text-muted-foreground">해약환급금</p>
																</div>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										</CardContent>
									</Card>
								</TabsContent>
								<TabsContent value="code">
									<Card className="overflow-hidden">
										<CardContent className="grid gap-6">
											<UICodeBlock
												language="tsx"
												filename="AssetPortfolio.tsx"
											>
												{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui';

function AssetPortfolio() {
	return (
		<div>
			<div className="mb-4">
				<h4 className="text-lg font-semibold mb-2">내 자산 현황</h4>
				<div className="flex items-baseline gap-2">
					<span className="text-3xl font-bold">45,782,500원</span>
					<span className="text-sm text-muted-foreground">총 자산</span>
				</div>
			</div>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<div className="flex justify-between items-center w-full pr-4">
							<div className="flex flex-col items-start gap-1">
								<span className="font-semibold">예금/적금</span>
								<span className="text-sm text-muted-foreground">3개 상품</span>
							</div>
							<div className="flex flex-col items-end gap-1">
								<span className="text-lg font-bold">25,000,000원</span>
								<span className="text-xs text-green-600">+150,000원 (이자)</span>
							</div>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
							<div className="flex justify-between items-center p-3 bg-background rounded border">
								<div>
									<p className="font-medium">S-정기예금</p>
									<p className="text-sm text-muted-foreground">신한은행 | 연 3.5%</p>
									<p className="text-xs text-muted-foreground mt-1">
										만기일: 2025.12.31 (35일 남음)
									</p>
								</div>
								<div className="text-right">
									<p className="font-semibold">10,000,000원</p>
									<p className="text-sm text-green-600">+85,000원</p>
								</div>
							</div>
							{/* 추가 상품... */}
						</div>
					</AccordionContent>
				</AccordionItem>
				{/* 추가 자산 카테고리... */}
			</Accordion>
		</div>
	);
}`}
											</UICodeBlock>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
						{/* 금융권 실무 예제 END */}
					</div>
				</div>
			</div>
		</>
	);
};

CommonBizFuncEx.displayName = 'CommonBizFuncEx';
export default CommonBizFuncEx;
