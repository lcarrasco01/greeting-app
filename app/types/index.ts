export type Occasion =
  | 'birthday'
  | 'anniversary'
  | 'graduation'
  | 'wedding'
  | 'baby_shower'
  | 'holiday'
  | 'thank_you'
  | 'get_well'
  | 'retirement'
  | 'sympathy'
  | 'congratulations'
  | 'other';

export type Vibe =
  | 'funny'
  | 'heartfelt'
  | 'romantic'
  | 'professional'
  | 'inspirational'
  | 'playful'
  | 'sincere'
  | 'poetic';

export type CardTheme = 'minimal' | 'colorful' | 'elegant' | 'fun';

export type GreetingLength = 'short' | 'medium' | 'long';

export interface GreetingFormData {
  occasion: Occasion;
  fromName: string;
  toName: string;
  age?: number;
  vibe: Vibe;
}

export interface GreetingVariation {
  length: GreetingLength;
  message: string;
}

export interface GeneratedGreeting {
  variations: GreetingVariation[];
  occasion: Occasion;
  fromName: string;
  toName: string;
  vibe: Vibe;
}

export type GenerateRequest = GreetingFormData;

export interface GenerateResponse {
  success: boolean;
  data?: GeneratedGreeting;
  error?: string;
}

export const OCCASION_LABELS: Record<Occasion, string> = {
  birthday: '🎂 Birthday',
  anniversary: '💍 Anniversary',
  graduation: '🎓 Graduation',
  wedding: '💒 Wedding',
  baby_shower: '👶 Baby Shower',
  holiday: '🎄 Holiday',
  thank_you: '🙏 Thank You',
  get_well: '💊 Get Well',
  retirement: '🌅 Retirement',
  sympathy: '🌸 Sympathy',
  congratulations: '🎉 Congratulations',
  other: '✉️ Other',
};

export const VIBE_LABELS: Record<Vibe, string> = {
  funny: '😄 Funny',
  heartfelt: '💖 Heartfelt',
  romantic: '❤️ Romantic',
  professional: '💼 Professional',
  inspirational: '✨ Inspirational',
  playful: '🎈 Playful',
  sincere: '🌿 Sincere',
  poetic: '📜 Poetic',
};

export const THEME_LABELS: Record<CardTheme, string> = {
  minimal: 'Minimal',
  colorful: 'Colorful',
  elegant: 'Elegant',
  fun: 'Fun',
};
