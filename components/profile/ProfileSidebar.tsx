'use client'

import Link from 'next/link'
import { User, Package, Heart, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SUser } from '@supabase/supabase-js'

export default function ProfileSidebar({ user }: { user: SUser }) {
  const supabase = createClient()
  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const items = [
    { icon: Package, label: 'Мої замовлення', href: '/profile', active: true },
    { icon: Heart, label: 'Обране', href: '/profile/favorites', active: false },
    { icon: Settings, label: 'Налаштування', href: '/profile/settings', active: false },
  ]

  return (
    <aside className="w-60 shrink-0 hidden md:block">
      <div className="card p-4">
        <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-100 mb-4">
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
          )}
          <div className="text-center">
            <p className="font-semibold text-sm">{user.user_metadata?.full_name ?? 'Користувач'}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </button>
        </nav>
      </div>
    </aside>
  )
}
