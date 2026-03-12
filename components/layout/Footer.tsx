"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <p className="text-xl font-bold text-indigo-400 mb-1">ShopFlow</p>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ShopFlow. Всі права захищені.
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 justify-center">
            {["Про нас", "Доставка", "Повернення", "Контакти"].map((l) => (
              <Link
                key={l}
                href="#"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                {l}
              </Link>
            ))}
          </nav>
          <div className="flex gap-4 justify-end">
            {["Telegram", "Instagram", "Facebook"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
