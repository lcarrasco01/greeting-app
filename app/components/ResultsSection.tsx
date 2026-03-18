'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Copy,
  Download,
  Check,
  RefreshCw,
  Palette,
} from 'lucide-react';
import { Button } from './ui/button';
import { CardPreview } from './CardPreview';
import {
  GeneratedGreeting,
  GreetingLength,
  CardTheme,
  THEME_LABELS,
} from '../types';
import { cn } from '../lib/utils';

interface ResultsSectionProps {
  greeting: GeneratedGreeting;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const LENGTH_LABELS: Record<GreetingLength, string> = {
  short: 'Short',
  medium: 'Medium',
  long: 'Long',
};

export function ResultsSection({ greeting, onRegenerate, isRegenerating }: ResultsSectionProps) {
  const [selectedLength, setSelectedLength] = useState<GreetingLength>('medium');
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('minimal');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentMessage =
    greeting.variations.find((v) => v.length === selectedLength)?.message || '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `greeting-card-${greeting.toName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Greeting Card</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Choose a variation and theme, then copy or download.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={isRegenerating}
          size="sm"
        >
          <RefreshCw className={cn('w-4 h-4', isRegenerating && 'animate-spin')} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>
      </div>

      {/* Length selector */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1.5">
          Message Length
        </p>
        <div className="flex gap-2 flex-wrap">
          {greeting.variations.map(({ length }) => (
            <button
              key={length}
              onClick={() => setSelectedLength(length)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
                selectedLength === length
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {LENGTH_LABELS[length]}
            </button>
          ))}
        </div>
      </div>

      {/* Message text */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {currentMessage}
        </p>
      </div>

      {/* Theme selector */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1.5">
          <Palette className="w-4 h-4" />
          Card Theme
        </p>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(THEME_LABELS) as CardTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
                selectedTheme === t
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {THEME_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center">
        <CardPreview
          ref={cardRef}
          greeting={greeting}
          selectedLength={selectedLength}
          theme={selectedTheme}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button onClick={handleCopy} variant="outline" size="lg" className="min-w-[140px]">
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Text
            </>
          )}
        </Button>

        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="lg"
          className="min-w-[160px]"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Saving...' : 'Download PNG'}
        </Button>
      </div>
    </div>
  );
}
