import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import { createServerClient } from '@/lib/supabase/server'
import type { Category, Product } from '@/types'

export default async function HomePage() {
  const supabase = createServerClient()

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('views', { ascending: false })
      .limit(8),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Знайди те що шукав
              </h1>
              <p className="text-indigo-100 text-lg mb-8 max-w-md">
                Тисячі товарів за найкращими цінами. Швидка доставка по всій країні.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Дивитись каталог <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4 max-w-xs md:max-w-sm">
              {['💻', '👟', '🏠', '⚽', '💄', '📚'].map((icon) => (
                <div key={icon} className="bg-white/20 rounded-2xl flex items-center justify-center text-3xl aspect-square backdrop-blur-sm">
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Категорії</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {(categories as Category[] ?? []).map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 bg-gray-100 hover:bg-indigo-500 hover:text-white px-5 py-4 rounded-xl transition-colors group min-w-[100px]"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-medium text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Популярні товари</h2>
            <Link href="/catalog" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Дивитись всі <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(products as Product[] ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {(!products || products.length === 0) && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Товарів поки немає</p>
              <p className="text-sm mt-2">Запустіть seed.sql у Supabase для тестових даних</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
