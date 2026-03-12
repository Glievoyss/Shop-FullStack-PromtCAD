'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) window.location.href = `/catalog?q=${encodeURIComponent(search)}`
  }

  const items = totalItems()

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600 shrink-0">
          ShopFlow
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук товарів..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {items > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {items > 99 ? '99+' : items}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <User className="w-5 h-5 text-gray-700" />
                )}
                <span className="text-sm text-gray-700 hidden sm:block">
                  {user.user_metadata?.full_name?.split(' ')[0] ?? 'Профіль'}
                </span>
              </Link>
              <button onClick={signOut} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <button onClick={signIn} className="btn-primary text-sm">
              Увійти
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
