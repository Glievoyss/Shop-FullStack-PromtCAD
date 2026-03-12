import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { shipping_address } = await req.json()

  // Get cart items
  const { data: cartItems, error: cartError } = await supabase
    .from('cart')
    .select('*, products(price, name)')
    .eq('user_id', user.id)

  if (cartError || !cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Calculate total
  const total_amount = cartItems.reduce((sum: number, item: any) => {
    return sum + item.products.price * item.quantity
  }, 0)

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: user.id, total_amount, shipping_address, status: 'new' })
    .select()
    .single()

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 })

  // Create order items
  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_purchase: item.products.price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  // Clear cart
  await supabase.from('cart').delete().eq('user_id', user.id)

  return NextResponse.json({ order_id: order.id })
}
