export const LANGUAGE_CODES = ['en', 'ja', 'uz', 'ru'] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export interface LanguageOption {
  code: LanguageCode;
  shortLabel: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', shortLabel: 'EN' },
  { code: 'ja', shortLabel: 'JA' },
  { code: 'uz', shortLabel: 'UZ' },
  { code: 'ru', shortLabel: 'RU'}
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';
