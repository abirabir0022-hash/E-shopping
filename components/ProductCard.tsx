'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const primaryImg = product.images?.find((i) => i.is_primary)?.image_url || product.images?.[0]?.image_url || '/placeholder.png';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ product, quantity: 1 });
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <Image
            src={primaryImg}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          {product.discount_percent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{product.discount_percent}%
            </span>
          )}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white rounded-full text-gray-600 hover:text-emerald-600 shadow-md transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <Link href={`/product/${product.slug}`} className="p-2 bg-white rounded-full text-gray-600 hover:text-emerald-600 shadow-md transition-colors">
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1">{product.brand}</div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
            {product.previous_price && (
              <span className="text-xs text-gray-400 line-through">৳{product.previous_price}</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleQuickAdd}
          disabled={product.stock_quantity <= 0}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};
