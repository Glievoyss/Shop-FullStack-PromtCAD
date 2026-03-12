'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)
  const items = useCartStore((s) => s.items)
  const inCart = items.some((i) => i.id === product.id)

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : null

  const imageUrl = product.image_urls?.[0] || `https://picsum.photos/seed/${product.id}/400/400`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
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

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="card overflow-hidden hover:-translate-y-1 transition-transform duration-200">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-2 min-h-[40px]">
            {product.name}
          </p>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({product.reviews_count})</span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold text-gray-900">
              {product.price.toLocaleString('uk-UA')} ₴
            </span>
            {product.old_price && (
              <span className="text-xs text-gray-400 line-through">
                {product.old_price.toLocaleString('uk-UA')} ₴
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              inCart
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? 'В кошику' : 'В кошик'}
          </button>
        </div>
      </div>
    </Link>
  )
}
