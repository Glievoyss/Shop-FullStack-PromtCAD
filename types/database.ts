export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  parent_id: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  old_price: number | null
  image_urls: string[]
  category_id: string | null
  brand: string | null
  sku: string | null
  stock: number
  views: number
  rating: number
  reviews_count: number
  is_active: boolean
  created_at: string
  categories?: Category
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products?: Product
}

export interface CartItemLocal {
  id: string
  name: string
  price: number
  old_price: number | null
  image_url: string
  quantity: number
  stock: number
}

export interface Order {
  id: string
  user_id: string
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: ShippingAddress | null
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  products?: Product
}

export interface ShippingAddress {
  name: string
  phone: string
  city: string
  street: string
  zip: string
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products?: Product
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  text: string | null
  created_at: string
  profiles?: Profile
}
