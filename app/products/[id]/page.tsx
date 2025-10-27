"use client";

import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { useCartStore } from "@/app/store/cart-store";
import { useState } from "react";
import Link from "next/link";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === resolvedParams.id);
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <FiArrowLeft />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-96">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <div className="mb-4">
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-blue-600 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-colors ${
                  product.inStock && !isAdding
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FiShoppingCart />
                {isAdding
                  ? "Added to Cart!"
                  : product.inStock
                  ? `Add ${quantity} to Cart`
                  : "Out of Stock"}
              </button>

              <Link
                href="/products"
                className="block text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
