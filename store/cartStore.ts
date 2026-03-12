import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemLocal } from '@/types'

interface CartStore {
  items: CartItemLocal[]
  isOpen: boolean
  addToCart: (product: CartItemLocal) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  totalItems: () => number
  totalAmount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (product) => {
        const items = get().items
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeFromCart(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'shopflow-cart' }
  )
)
