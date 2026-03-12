import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest, NextResponse } from 'next/server'

export const createMiddlewareSupabase = (req: NextRequest, res: NextResponse) =>
  createMiddlewareClient({ req, res })
