import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildGreetingPrompt } from '../../lib/prompt';
import {
  GenerateRequest,
  GenerateResponse,
  GeneratedGreeting,
  GreetingVariation,
} from '../../types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    const body: GenerateRequest = await req.json();

    // Validate required fields
    if (!body.occasion || !body.fromName || !body.toName || !body.vibe) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: occasion, fromName, toName, vibe' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const data: GenerateRequest = {
      occasion: body.occasion,
      fromName: body.fromName.trim().slice(0, 100),
      toName: body.toName.trim().slice(0, 100),
      vibe: body.vibe,
      age: body.age ? Math.min(Math.max(Number(body.age), 1), 150) : undefined,
    };

    const prompt = buildGreetingPrompt(data);

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract text content
    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI');
    }

    // Parse JSON response — extract from potential markdown code blocks
    let jsonText = textBlock.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonText) as { short: string; medium: string; long: string };

    const variations: GreetingVariation[] = [
      { length: 'short', message: parsed.short },
      { length: 'medium', message: parsed.medium },
      { length: 'long', message: parsed.long },
    ];

    const result: GeneratedGreeting = {
      variations,
      occasion: data.occasion,
      fromName: data.fromName,
      toName: data.toName,
      vibe: data.vibe,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Generation error:', message, error);

    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key. Please check your ANTHROPIC_API_KEY.' },
        { status: 401 }
      );
    }

    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { success: false, error: 'Rate limit reached. Please try again shortly.' },
        { status: 429 }
      );
    }

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { success: false, error: `API error ${(error as Anthropic.APIError).status}: ${message}` },
        { status: 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Failed to generate greeting: ${message}` },
      { status: 500 }
    );
  }
}
