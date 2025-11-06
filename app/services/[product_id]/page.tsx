"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCartStore } from "@/app/store/cart-store";
import Link from "next/link";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { Product } from "@/types/product";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://148.230.125.200:9060";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch product: Try static data first, then backend
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        // STEP 1: Try static data first
        console.log("📦 Looking for product in static data, product_id:", resolvedParams.product_id);
        const { products: staticProducts } = await import('@/data/products');
        const staticProduct = staticProducts.find(p => p.id === resolvedParams.product_id);
        
        if (staticProduct) {
          console.log("✅ Found product in static data:", staticProduct.name);
          setProduct(staticProduct);
          setLoading(false);
          return;
        }
        
        console.log("⚠️ Product not in static data, trying backend...");
        
        // STEP 2: If not found in static, try backend
        const service_id = resolvedParams.product_id;
        const url = `${BACKEND_URL}/api/services/${service_id}`;
        console.log("🔍 Fetching from backend:", url);
        
        const response = await fetch(url, {
          signal: AbortSignal.timeout(3000)
        });
        
        if (!response.ok) {
          console.warn("❌ Product not found in backend:", response.status);
          setProduct(null);
          setLoading(false);
          return;
        }

        const backendProduct = await response.json();
        
        // Filter out free services (price = 0)
        if (backendProduct.price === 0 || !backendProduct.price) {
          console.warn("⚠️ Backend returned free service, skipping");
          setProduct(null);
          setLoading(false);
          return;
        }
        
        console.log("✅ Product from backend:", backendProduct);
        
        const productImage = backendProduct.image && 
                             backendProduct.image !== "" && 
                             !backendProduct.image.includes("placeholder") &&
                             !backendProduct.image.includes("example.com")
          ? backendProduct.image 
          : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
        
        setProduct({
          id: String(backendProduct.id || resolvedParams.product_id),
          name: backendProduct.name || "",
          price: backendProduct.price || 0,
          description: backendProduct.description || "",
          image: productImage,
          category: backendProduct.category || "غير مصنف",
          inStock: backendProduct.inStock !== false,
        });
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.product_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

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
          href="/services"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <FiArrowLeft />
          العودة للمنتجات
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
              {product.price.toFixed(2)} ر.س
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">
                الكمية
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
                  ? "تمت الإضافة!"
                  : product.inStock
                  ? `إضافة ${quantity} إلى السلة`
                  : "غير متوفر"}
              </button>

              <Link
                href="/services"
                className="block text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

