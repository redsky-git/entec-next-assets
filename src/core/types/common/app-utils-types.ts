export interface IUtils {
	hashStringTo32BitInteger(str: string): any;
	string: IString;
	date: IDate;
	format: IFormat;
}

export interface IString {
	toCamelCase(str: string): string;
}

export interface IDate {
	formatDate(date: Date | string | number, format: string): string;
}

export interface IFormat {
	// 숫자 포맷
	number: (value: number | string, decimals?: number) => string;
	currency: (value: number | string, currency?: string) => string;
	percent: (value: number | string, decimals?: number) => string;

	// 금융 포맷
	account: (value: string) => string;
	card: (value: string) => string;
	amount: (value: number | string, showSign?: boolean) => string;

	// 개인정보 포맷
	phone: (value: string, type?: 'default' | 'dash' | 'dot') => string;
	email: (value: string, maskLevel?: number) => string;
	residentNumber: (value: string, maskBack?: boolean) => string;
	name: (value: string, maskLevel?: number) => string;

	// 날짜/시간 포맷
	date: (value: string | Date, format?: string) => string;
	datetime: (value: string | Date) => string;
	period: (start: string | Date, end: string | Date) => string;

	// 비즈니스 포맷
	businessNumber: (value: string) => string;
	corporationNumber: (value: string) => string;

	// 파일/데이터 포맷
	fileSize: (bytes: number, decimals?: number) => string;
	bytes: (bytes: number) => string;

	// 기타 유틸
	ellipsis: (text: string, maxLength: number, suffix?: string) => string;
	mask: (value: string, start: number, end: number, maskChar?: string) => string;
	padStart: (value: string | number, length: number, char?: string) => string;
	padEnd: (value: string | number, length: number, char?: string) => string;
}
