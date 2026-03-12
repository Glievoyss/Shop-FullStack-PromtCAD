import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { product_id, rating, text } = await req.json()

  if (!product_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ user_id: user.id, product_id, rating, text })
    .select('*, profiles(full_name, avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
