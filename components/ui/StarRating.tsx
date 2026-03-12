import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  )
}
