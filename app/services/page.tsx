"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://148.230.125.200:9060";

// Categories for filtering (Arabic categories matching backend data)
const categories = [
  "الكل",
  "الإلكترونيات",
  "الأزياء والموضة",
  "المنزل والمطبخ",
  "الرياضة واللياقة",
  "الجمال والعناية",
  "الكتب والألعاب",
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get search and category from URL
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";
    
    setSearchQuery(urlSearch);
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Fetch products - Use static data with optional backend search
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Import static products data
        const { products: staticProducts } = await import('@/data/products');
        console.log(`📦 Loaded ${staticProducts.length} products from static data`);

        // If there's a search query, try backend search
        if (searchQuery && searchQuery.trim() !== "") {
          console.log("🔍 Searching backend for:", searchQuery);
          try {
            const url = `${BACKEND_URL}/api/services/search?query=${encodeURIComponent(searchQuery)}&k=20`;
            const response = await fetch(url, { 
              signal: AbortSignal.timeout(3000) // 3 second timeout
            });

            if (response.ok) {
              const data = await response.json();
              
              if (data.services && data.services.length > 0) {
                // Filter backend results to only include valid products
                const backendProducts = data.services
                  .filter((s: any) => s.price > 0) // Exclude free services
                  .map((service: any) => ({
                    id: String(service.id),
                    name: service.name || "",
                    price: service.price || 0,
                    description: service.description || "",
                    image: service.image && !service.image.includes("placeholder") && !service.image.includes("example.com")
                      ? service.image
                      : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                    category: service.category || "غير مصنف",
                    inStock: service.inStock !== false,
                  }));

                if (backendProducts.length > 0) {
                  console.log(`✅ Found ${backendProducts.length} products in backend`);
                  setProducts(backendProducts);
                  setLoading(false);
                  return;
                }
              }
            }
          } catch (backendError) {
            console.warn("⚠️ Backend search failed, using static data:", backendError);
          }

          // Fallback: search in static data
          const searchLower = searchQuery.toLowerCase();
          const filtered = staticProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
          );
          
          console.log(`🔍 Found ${filtered.length} products in static data matching "${searchQuery}"`);
          setProducts(filtered);
        } else {
          // No search query - show all static products
          setProducts(staticProducts);
        }
      } catch (err) {
        console.error("❌ Error loading products:", err);
        setProducts([]);
        setError("فشل تحميل المنتجات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Filter products by category
  const filteredProducts = products.filter((product) => {
    return selectedCategory === "الكل" || product.category === selectedCategory;
  });

  // Get product count per category
  const getCategoryCount = (category: string) => {
    if (category === "الكل") return products.length;
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">جميع المنتجات</h1>
          <p className="text-gray-600">
            {loading ? (
              "جاري التحميل..."
            ) : (
              `${products.length} منتج متاح`
            )}
          </p>
        </div>
        
        {/* Search indicator */}
        {searchQuery && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700">
              نتائج البحث عن: <span className="font-semibold text-blue-600">"{searchQuery}"</span>
              {filteredProducts.length > 0 && ` - تم العثور على ${filteredProducts.length} منتج`}
            </p>
            {error && (
              <p className="text-amber-600 text-sm mt-2">⚠️ {error}</p>
            )}
            {loading && (
              <p className="text-blue-600 text-sm mt-2">🔍 جاري البحث في قاعدة البيانات...</p>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">التصنيفات</h2>
          <div className="flex gap-3 flex-wrap">
            {categories.map((category) => {
              const count = getCategoryCount(category);
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery(""); // Clear search when changing category
                  }}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200"
                  }`}
                >
                  <span className="font-medium">{category}</span>
                  {!loading && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-600 text-xl font-medium">جاري تحميل المنتجات...</p>
            <p className="text-gray-500 text-sm mt-2">يرجى الانتظار قليلاً</p>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-700 text-xl font-medium mb-2">
              لا توجد منتجات في هذا التصنيف
            </p>
            <p className="text-gray-500">
              {searchQuery 
                ? `لم يتم العثور على نتائج لـ "${searchQuery}"`
                : `اختر تصنيفاً آخر لعرض المنتجات`}
            </p>
          </div>
        )}

        {!loading && products.length === 0 && !searchQuery && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-700 text-xl font-medium mb-2">
              لا توجد منتجات حالياً
            </p>
            <p className="text-gray-500">يرجى المحاولة مرة أخرى لاحقاً</p>
          </div>
        )}
      </div>
    </div>
  );
}
