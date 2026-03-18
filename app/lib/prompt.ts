import { GreetingFormData } from '../types';

export function buildGreetingPrompt(data: GreetingFormData): string {
  const { occasion, fromName, toName, age, vibe } = data;

  const occasionFormatted = occasion.replace(/_/g, ' ');
  const ageClause = age ? ` (turning ${age})` : '';

  return `You are a professional greeting card writer. Write 3 versions of a greeting card message.

Occasion: ${occasionFormatted}
From: ${fromName}
To: ${toName}${ageClause}
Tone/Vibe: ${vibe}

Requirements:
- Version 1 (SHORT): 1-2 sentences, punchy and memorable
- Version 2 (MEDIUM): 3-5 sentences, warm and personal
- Version 3 (LONG): 6-10 sentences, rich and detailed

Rules:
- Naturally include both names (${fromName} and ${toName})
- Match the ${vibe} tone throughout
${age ? `- Reference the age (${age}) naturally in at least one version` : ''}
- Make each version feel distinct, not just truncated versions of each other
- No generic filler — every word should count
- Do NOT include salutations like "Dear" at the start
- Do NOT include sign-offs like "Love," or "Sincerely," at the end

Respond ONLY with valid JSON in this exact format:
{
  "short": "...",
  "medium": "...",
  "long": "..."
}`;
}
