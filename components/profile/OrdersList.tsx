'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Order } from '@/types'

const statusConfig = {
  new: { label: 'Новий', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'В обробці', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Відправлено', color: 'bg-orange-100 text-orange-700' },
  delivered: { label: 'Доставлено', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Скасовано', color: 'bg-red-100 text-red-700' },
}

export default function OrdersList({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📦</p>
        <p>Замовлень ще немає</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const status = statusConfig[order.status] ?? statusConfig.new
        const isOpen = expanded === order.id
        const items = (order as any).order_items ?? []

        return (
          <div key={order.id} className="card overflow-hidden">
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(isOpen ? null : order.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium text-sm">
                    Замовлення #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{order.total_amount.toLocaleString('uk-UA')} ₴</p>
                <p className="text-xs text-gray-400">{items.length} товарів</p>
              </div>
            </div>

            {isOpen && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 p-3 px-4">
                    {item.products?.image_urls?.[0] && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                        <Image
                          src={item.products.image_urls[0]}
                          alt={item.products?.name ?? ''}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.products?.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} шт. × {item.price_at_purchase.toLocaleString('uk-UA')} ₴</p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      {(item.quantity * item.price_at_purchase).toLocaleString('uk-UA')} ₴
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
