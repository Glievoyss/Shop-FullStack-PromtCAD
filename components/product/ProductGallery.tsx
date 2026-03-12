'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ imageUrls, name }: { imageUrls: string[]; name: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
        <Image
          src={imageUrls[active]}
          alt={name}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                i === active ? 'border-indigo-500' : 'border-transparent'
              }`}
            >
              <Image src={url} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
