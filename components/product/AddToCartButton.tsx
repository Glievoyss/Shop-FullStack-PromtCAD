'use client'

import { useState } from 'react'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const addToCart = useCartStore((s) => s.addToCart)
  const items = useCartStore((s) => s.items)
  const inCart = items.some((i) => i.id === product.id)

  const imageUrl = product.image_urls?.[0] || `https://picsum.photos/seed/${product.id}/400/400`

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        old_price: product.old_price,
        image_url: imageUrl,
        quantity: 1,
        stock: product.stock,
      })
    }
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Quantity */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{qty}</span>
        <button
          onClick={() => setQty(Math.min(product.stock, qty + 1))}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-400">В наявності: {product.stock} шт.</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-xl font-semibold text-base transition-colors ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : inCart
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stock === 0 ? 'Немає в наявності' : inCart ? 'В кошику ✓' : 'В кошик'}
        </button>
        <button className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors">
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  )
}
