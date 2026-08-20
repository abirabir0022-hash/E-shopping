export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  specifications: Record<string, string>;
  price: number;
  previous_price?: number;
  discount_percent: number;
  sku: string;
  stock_quantity: number;
  category_id: string;
  subcategory_id?: string;
  brand: string;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_flash_sale: boolean;
  rating: number;
  review_count: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  stock_quantity: number;
  price_override?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

export type Order = {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  division: string;
  district: string;
  area: string;
  delivery_note?: string;
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  created_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id?: string;
  product_title: string;
  unit_price: number;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  subtotal: number;
};
