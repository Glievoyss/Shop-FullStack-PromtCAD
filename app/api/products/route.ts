import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(req.url)

  const category_slug = searchParams.get('category_slug')
  const min_price = searchParams.get('min_price')
  const max_price = searchParams.get('max_price')
  const sort = searchParams.get('sort') ?? 'newest'
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 12)
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select('*, categories(*)', { count: 'exact' })
    .eq('is_active', true)

  if (category_slug) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category_slug).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (min_price) query = query.gte('price', Number(min_price))
  if (max_price) query = query.lte('price', Number(max_price))

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    price_asc: { col: 'price', asc: true },
    price_desc: { col: 'price', asc: false },
    rating: { col: 'rating', asc: false },
    newest: { col: 'created_at', asc: false },
  }
  const s = sortMap[sort] ?? sortMap.newest
  query = query.order(s.col, { ascending: s.asc }).range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count })
}
