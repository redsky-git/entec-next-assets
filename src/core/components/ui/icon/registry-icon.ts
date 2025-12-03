import * as LucideIcons from 'lucide-react';

// lucide-react의 모든 export를 그대로 사용
export const Icons = LucideIcons;

// 타입 추출
export type IconName = keyof typeof LucideIcons;
export type IconComponent = LucideIcons.LucideIcon;
