"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types";

interface SearchParams {
  category?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
  page?: string;
  q?: string;
}

interface Props {
  categories: Category[];
  searchParams: Record<string, string | undefined> | SearchParams;
}

export default function CatalogFilters({ categories, searchParams }: Props) {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(searchParams.min_price ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.max_price ?? "");

  const applyFilters = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { ...searchParams, page: "1", ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/catalog?${params.toString()}`);
  };

  const reset = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/catalog");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Фільтри</h3>
        <button
          onClick={reset}
          className="text-xs text-indigo-600 hover:underline"
        >
          Скинути
        </button>
      </div>

      {/* Categories */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Категорії</p>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={searchParams.category === cat.slug}
                onChange={() => applyFilters({ category: cat.slug })}
                className="accent-indigo-500"
              />
              <span className="text-sm text-gray-600">
                {cat.icon} {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Price */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Ціна (₴)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="від"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
          <input
            type="number"
            placeholder="до"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>
      </div>

      <button
        onClick={() =>
          applyFilters({ min_price: minPrice, max_price: maxPrice })
        }
        className="w-full btn-primary text-sm"
      >
        Застосувати
      </button>
    </div>
  );
}
