"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cart-store";
import { useAuthStore } from "@/app/store/auth-store";
import { FiShoppingCart, FiMenu, FiUser, FiLogOut } from "react-icons/fi";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [itemCount, setItemCount] = React.useState(0);

  // Fix hydration error by updating cart count after mount
  React.useEffect(() => {
    // Set initial count
    setItemCount(useCartStore.getState().getItemCount());

    // Subscribe to cart changes
    const unsubscribe = useCartStore.subscribe((state) => {
      setItemCount(state.getItemCount());
    });

    return unsubscribe;
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TSTCommerce
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Cart
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Profile Link */}
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  title={user.name || user.email}
                >
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">{user.name || user.email.split('@')[0]}</span>
                </Link>
                
                {/* Logout Icon */}
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="hidden md:flex p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FiUser className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Shopping Cart"
            >
              <FiShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-1">
            <Link
              href="/"
              className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/cart"
              className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-4 h-4" />
                  {user.name || user.email}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    router.push("/");
                  }}
                  className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
