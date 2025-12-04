/**
 * 카드번호 마스킹 옵션 인터페이스
 */
export interface CardMaskOptions {
	/** 마스킹 문자 (기본값: '*') */
	maskChar?: string;
	/** 앞에서 보여줄 자릿수 (기본값: 4) */
	visibleStart?: number;
	/** 뒤에서 보여줄 자릿수 (기본값: 4) */
	visibleEnd?: number;
	/** 구분자 (기본값: '-') */
	separator?: string;
	/** 구분자를 사용할지 여부 (기본값: true) */
	useSeparator?: boolean;
}

/**
 * 카드번호를 마스킹 처리합니다.
 *
 * @param cardNumber - 마스킹할 카드번호 (숫자 또는 하이픈 포함 문자열)
 * @param options - 마스킹 옵션
 * @returns 마스킹된 카드번호
 */
export const maskCardNumber = (cardNumber: string, options: CardMaskOptions = {}): string => {
	const { maskChar = '*', visibleStart = 4, visibleEnd = 4, separator = '-', useSeparator = true } = options;

	// 카드번호에서 숫자만 추출
	const digitsOnly = cardNumber.replace(/\D/g, '');

	// 유효성 검사
	if (!digitsOnly || digitsOnly.length < 8) {
		return cardNumber; // 유효하지 않은 경우 원본 반환
	}

	const totalLength = digitsOnly.length;
	const maskLength = totalLength - visibleStart - visibleEnd;

	// 앞부분, 마스킹 부분, 뒷부분 생성
	const startPart = digitsOnly.slice(0, visibleStart);
	const maskedPart = maskChar.repeat(Math.max(0, maskLength));
	const endPart = digitsOnly.slice(totalLength - visibleEnd);

	const masked = startPart + maskedPart + endPart;

	// 구분자 추가
	if (useSeparator && totalLength >= 16) {
		// 4자리씩 구분
		return masked.match(/.{1,4}/g)?.join(separator) || masked;
	}

	return masked;
};
