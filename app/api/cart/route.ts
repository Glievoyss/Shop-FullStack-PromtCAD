import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function getUser(supabase: ReturnType<typeof createRouteHandlerClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('cart')
    .select('*, products(*)')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { product_id, quantity = 1 } = await req.json()
  const { data, error } = await supabase
    .from('cart')
    .upsert({ user_id: user.id, product_id, quantity }, { onConflict: 'user_id,product_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { product_id, quantity } = await req.json()
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { product_id } = await req.json()
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', product_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
