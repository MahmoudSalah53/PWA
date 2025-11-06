"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCartStore } from "@/app/store/cart-store";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/services/${product.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <div className="flex items-center mb-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link href={`/services/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 min-h-[3.5rem] line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex-grow">
          {product.description}
        </p>

        {/* Price & Button - Fixed at bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              product.inStock && !isAdding
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FiShoppingCart className="w-4 h-4" />
            {isAdding
              ? "Added!"
              : product.inStock
              ? "Add to Cart"
              : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
