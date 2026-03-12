import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductGallery from '@/components/product/ProductGallery'
import AddToCartButton from '@/components/product/AddToCartButton'
import ReviewsSection from '@/components/product/ReviewsSection'
import StarRating from '@/components/ui/StarRating'
import { createServerClient } from '@/lib/supabase/server'
import type { Product, Review } from '@/types'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createServerClient()
  const { data } = await supabase.from('products').select('name, description').eq('id', params.id).single()
  return { title: data?.name ?? 'Товар', description: data?.description ?? undefined }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const [{ data: product }, { data: reviews }] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', params.id)
      .single(),
    supabase
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('product_id', params.id)
      .order('created_at', { ascending: false }),
  ])

  if (!product) notFound()
  const p = product as Product

  const discount = p.old_price
    ? Math.round(((p.old_price - p.price) / p.old_price) * 100)
    : null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Gallery */}
          <div className="md:w-1/2">
            <ProductGallery imageUrls={p.image_urls?.length ? p.image_urls : [`https://picsum.photos/seed/${p.id}/600/600`]} name={p.name} />
          </div>

          {/* Info */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>

            {p.rating > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={p.rating} size="md" />
                <span className="text-sm text-gray-500">{p.rating.toFixed(1)} ({p.reviews_count} відгуків)</span>
              </div>
            )}

            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {p.price.toLocaleString('uk-UA')} ₴
              </span>
              {p.old_price && (
                <span className="text-lg text-gray-400 line-through">
                  {p.old_price.toLocaleString('uk-UA')} ₴
                </span>
              )}
              {discount && (
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                  -{discount}%
                </span>
              )}
            </div>

            {p.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit">
              🚚 Доставка 2–5 днів
            </div>

            <AddToCartButton product={p} />
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection productId={p.id} reviews={reviews as Review[] ?? []} />
      </main>
      <Footer />
    </div>
  )
}
