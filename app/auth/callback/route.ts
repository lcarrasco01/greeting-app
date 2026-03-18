import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

/**
 * Supabase redirects here after email confirmation / OAuth.
 * We exchange the one-time code for a session, then send the
 * user to the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send to login with an error flag
  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`);
}
