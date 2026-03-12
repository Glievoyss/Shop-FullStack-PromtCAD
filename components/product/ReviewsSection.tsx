'use client'

import { useState } from 'react'
import { User } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/types'

export default function ReviewsSection({ productId, reviews: initialReviews }: { productId: string; reviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }))

  const submitReview = async () => {
    setLoading(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, rating, text }),
    })
    if (res.ok) {
      const { data } = await res.json()
      setReviews([data, ...reviews])
      setShowForm(false)
      setText('')
    }
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-6">Відгуки ({reviews.length})</h2>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Summary */}
        <div className="md:w-48 shrink-0 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6">
          <span className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</span>
          <StarRating rating={avg} size="md" />
          <span className="text-sm text-gray-500 mt-1">{reviews.length} відгуків</span>
        </div>
        <div className="flex-1 space-y-2">
          {ratingCounts.map(({ r, count }) => (
            <div key={r} className="flex items-center gap-3 text-sm">
              <span className="w-4 text-gray-600">{r}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full"
                  style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }}
                />
              </div>
              <span className="w-4 text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-primary mb-6">
          Написати відгук
        </button>
      )}

      {showForm && (
        <div className="card p-4 mb-6">
          <h3 className="font-medium mb-3">Ваш відгук</h3>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= rating ? 'opacity-100' : 'opacity-30'}`}>
                ⭐
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Поділіться враженнями про товар..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none h-24"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={submitReview} disabled={loading} className="btn-primary text-sm">
              {loading ? 'Відправка...' : 'Надіслати'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Скасувати</button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                {(review as any).profiles?.avatar_url ? (
                  <img src={(review as any).profiles.avatar_url} alt="" className="w-9 h-9 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{(review as any).profiles?.full_name ?? 'Користувач'}</span>
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(review.created_at).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                {review.text && <p className="text-sm text-gray-600">{review.text}</p>}
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-400 text-sm">Відгуків ще немає. Будьте першим!</p>
        )}
      </div>
    </section>
  )
}
