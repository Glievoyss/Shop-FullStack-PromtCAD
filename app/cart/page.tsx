'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShieldCheck } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalAmount } = useCartStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [address, setAddress] = useState({ name: '', phone: '', city: '', street: '', zip: '' })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const supabase = createClient()

  const total = totalAmount()
  const shipping = total >= 1500 ? 0 : 99

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })
      return
    }
    setShowAddressForm(true)
  }

  const placeOrder = async () => {
    setCheckingOut(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipping_address: address }),
    })
    if (res.ok) {
      clearCart()
      window.location.href = '/profile'
    }
    setCheckingOut(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Кошик</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-gray-500 mb-4">Кошик порожній</p>
            <Link href="/catalog" className="btn-primary">Перейти до каталогу</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Items */}
            <div className="flex-1">
              <div className="card divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-indigo-600 font-semibold mt-1">{item.price.toLocaleString('uk-UA')} ₴</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString('uk-UA')} ₴</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 mt-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/catalog" className="inline-block mt-4 text-sm text-indigo-600 hover:underline">← Продовжити покупки</Link>
            </div>

            {/* Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="card p-5 sticky top-20">
                <h2 className="font-semibold text-lg mb-4">Підсумок</h2>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Товари ({items.length} шт.)</span>
                    <span>{total.toLocaleString('uk-UA')} ₴</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Доставка</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Безкоштовно' : `${shipping} ₴`}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Разом</span>
                    <span>{(total + shipping).toLocaleString('uk-UA')} ₴</span>
                  </div>
                </div>

                {!showAddressForm ? (
                  <button onClick={handleCheckout} className="w-full btn-primary py-3 text-base">
                    Оформити замовлення
                  </button>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Адреса доставки</h3>
                    {[
                      { key: 'name', placeholder: "Ваше ім'я" },
                      { key: 'phone', placeholder: 'Телефон' },
                      { key: 'city', placeholder: 'Місто' },
                      { key: 'street', placeholder: 'Вулиця та будинок' },
                      { key: 'zip', placeholder: 'Індекс' },
                    ].map(({ key, placeholder }) => (
                      <input
                        key={key}
                        type="text"
                        placeholder={placeholder}
                        value={address[key as keyof typeof address]}
                        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    ))}
                    <button onClick={placeOrder} disabled={checkingOut} className="w-full btn-primary py-3">
                      {checkingOut ? 'Оформлення...' : 'Підтвердити замовлення'}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4">
                  <ShieldCheck className="w-4 h-4" />
                  Безпечна оплата
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
