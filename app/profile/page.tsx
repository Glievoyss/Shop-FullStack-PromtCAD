import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProfileSidebar from '@/components/profile/ProfileSidebar'
import OrdersList from '@/components/profile/OrdersList'
import { createServerClient } from '@/lib/supabase/server'
import type { Order } from '@/types'

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_urls, price))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex gap-6">
          <ProfileSidebar user={user} />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-6">Мої замовлення</h2>
            <OrdersList orders={orders as Order[] ?? []} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
