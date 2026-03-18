'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { GreetingForm } from './GreetingForm';
import { ResultsSection } from './ResultsSection';
import { GreetingFormData, GeneratedGreeting, GenerateResponse } from '../types';
import { createClient } from '../lib/supabase/client';

export function BuilderPage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState<GeneratedGreeting | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<GreetingFormData | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const generate = async (data: GreetingFormData, isRegen = false) => {
    if (isRegen) setIsRegenerating(true);
    else setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json: GenerateResponse = await res.json();

      if (!json.success || !json.data) {
        throw new Error(json.error || 'Generation failed');
      }

      setGreeting(json.data);
      setLastFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleSubmit = async (data: GreetingFormData) => {
    await generate(data, false);
  };

  const handleRegenerate = async () => {
    if (!lastFormData) return;
    await generate(lastFormData, true);
  };

  const handleClear = () => {
    setGreeting(null);
    setError(null);
    setLastFormData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💌</span>
            <span className="font-bold text-gray-900 text-lg">CardAI</span>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[200px]">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Page title */}
        {!greeting && (
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
              Create a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
                perfect greeting
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Fill in the details below and let AI craft a personalized greeting card message in seconds.
            </p>
          </div>
        )}

        <div className={`grid gap-10 ${greeting ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
          {/* Form panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {greeting && (
              <h2 className="text-lg font-bold text-gray-900 mb-5">Edit Details</h2>
            )}
            <GreetingForm onSubmit={handleSubmit} onClear={handleClear} isLoading={isLoading} />
          </div>

          {/* Results panel */}
          {greeting && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <ResultsSection
                greeting={greeting}
                onRegenerate={handleRegenerate}
                isRegenerating={isRegenerating}
              />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 max-w-xl mx-auto rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-2">
            <span className="text-red-400 mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Feature highlights — shown before first generation */}
        {!greeting && !isLoading && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: '✨', title: '3 Variations', desc: 'Short, medium, and long versions generated instantly.' },
              { icon: '🎨', title: '4 Themes', desc: 'Choose from Minimal, Colorful, Elegant, or Fun card styles.' },
              { icon: '📥', title: 'Download & Share', desc: 'Copy the text or download your card as a PNG image.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-5 rounded-xl bg-violet-50 border border-violet-100">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 mt-20 py-6 text-center text-sm text-gray-400">
        Powered by Claude AI &middot; CardAI
      </footer>
    </div>
  );
}
