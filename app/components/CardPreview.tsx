'use client';

import { forwardRef } from 'react';
import { CardTheme, GeneratedGreeting, GreetingLength, OCCASION_LABELS } from '../types';
import { cn } from '../lib/utils';

interface CardPreviewProps {
  greeting: GeneratedGreeting;
  selectedLength: GreetingLength;
  theme: CardTheme;
}

const THEME_STYLES: Record<
  CardTheme,
  { container: string; inner: string; title: string; message: string; footer: string; decorator: string }
> = {
  minimal: {
    container: 'bg-white border border-gray-200 shadow-md',
    inner: 'p-10',
    title: 'text-gray-400 text-xs font-semibold tracking-[0.2em] uppercase',
    message: 'text-gray-800 text-lg leading-relaxed font-serif',
    footer: 'text-gray-400 text-sm mt-6 pt-6 border-t border-gray-100',
    decorator: '',
  },
  colorful: {
    container: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 shadow-xl',
    inner: 'p-10',
    title: 'text-pink-100 text-xs font-bold tracking-[0.2em] uppercase',
    message: 'text-white text-lg leading-relaxed font-semibold drop-shadow',
    footer: 'text-pink-100 text-sm mt-6 pt-6 border-t border-white/20',
    decorator: 'absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden',
  },
  elegant: {
    container: 'bg-stone-900 shadow-2xl',
    inner: 'p-12',
    title: 'text-amber-400 text-xs font-semibold tracking-[0.3em] uppercase',
    message: 'text-stone-100 text-lg leading-relaxed font-serif italic',
    footer: 'text-amber-400/70 text-sm mt-6 pt-6 border-t border-amber-400/20',
    decorator: 'absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5',
  },
  fun: {
    container: 'bg-yellow-300 border-4 border-orange-400 shadow-[6px_6px_0px_#f97316]',
    inner: 'p-10',
    title: 'text-orange-600 text-xs font-black tracking-[0.2em] uppercase',
    message: 'text-gray-900 text-lg leading-relaxed font-bold',
    footer: 'text-orange-600 text-sm mt-6 pt-6 border-t-2 border-orange-400',
    decorator: '',
  },
};

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ greeting, selectedLength, theme }, ref) => {
    const variation = greeting.variations.find((v) => v.length === selectedLength);
    const message = variation?.message || '';
    const styles = THEME_STYLES[theme];
    const occasionLabel = OCCASION_LABELS[greeting.occasion]?.replace(/^.+\s/, '') || greeting.occasion;

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl overflow-hidden w-full max-w-lg mx-auto transition-all duration-300',
          styles.container
        )}
        style={{ minHeight: '320px' }}
      >
        {/* Decorative elements */}
        {theme === 'colorful' && (
          <div className={styles.decorator} aria-hidden="true">
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full bg-white" />
          </div>
        )}
        {theme === 'elegant' && (
          <div className={styles.decorator} aria-hidden="true">
            <div className="absolute top-4 left-4 w-32 h-32 border-2 border-amber-400 rounded-full" />
            <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-amber-400 rounded-full" />
          </div>
        )}
        {theme === 'fun' && (
          <div className="absolute top-3 right-4 text-3xl" aria-hidden="true">🎉</div>
        )}

        <div className={styles.inner}>
          {/* Occasion badge */}
          <p className={cn(styles.title, 'mb-5')}>
            {occasionLabel}
          </p>

          {/* Main message */}
          <blockquote className={styles.message}>
            &ldquo;{message}&rdquo;
          </blockquote>

          {/* Footer */}
          <div className={styles.footer}>
            <p>
              <span className="opacity-60">To </span>
              <span className="font-semibold">{greeting.toName}</span>
              <span className="opacity-60">, with love from </span>
              <span className="font-semibold">{greeting.fromName}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
);
CardPreview.displayName = 'CardPreview';
