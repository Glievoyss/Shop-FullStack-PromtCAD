import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabase } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabase(req, res)
  const { data: { session } } = await supabase.auth.getSession()

  const protectedPaths = ['/profile']
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/profile/:path*'],
}
