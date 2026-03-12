import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import CatalogFilters from "@/components/product/CatalogFilters";
import { createServerClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types";
import SortSelect from "../../components/product/SortSelect";

interface SearchParams {
  category?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
  page?: string;
  q?: string;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createServerClient();
  const page = Number(searchParams.page ?? 1);
  const limit = 12;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select("*, categories(*)", { count: "exact" })
    .eq("is_active", true);

  if (searchParams.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`);
  }

  if (searchParams.min_price)
    query = query.gte("price", Number(searchParams.min_price));
  if (searchParams.max_price)
    query = query.lte("price", Number(searchParams.max_price));

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    price_asc: { col: "price", asc: true },
    price_desc: { col: "price", asc: false },
    rating: { col: "rating", asc: false },
    newest: { col: "created_at", asc: false },
  };
  const s = sortMap[searchParams.sort ?? "newest"] ?? sortMap.newest;
  query = query
    .order(s.col, { ascending: s.asc })
    .range(offset, offset + limit - 1);

  const [{ data: products, count }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("*").order("name"),
  ]);

  const totalPages = Math.ceil((count ?? 0) / limit);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">
          {searchParams.q ? `Пошук: "${searchParams.q}"` : "Каталог товарів"}
        </h1>
        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside className="w-64 shrink-0 hidden md:block">
            <CatalogFilters
              categories={(categories as Category[]) ?? []}
              searchParams={searchParams}
            />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{count ?? 0} товарів</p>
              <SortSelect current={searchParams.sort} />
            </div>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(products as Product[]).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p>Товарів не знайдено</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <a
                      key={p}
                      href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-indigo-500 text-white"
                          : "bg-white border border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {p}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
