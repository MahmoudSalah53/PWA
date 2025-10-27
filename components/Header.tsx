"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cart-store";
import { useAuthStore } from "@/app/store/auth-store";
import { FiShoppingCart, FiMenu, FiUser, FiLogOut } from "react-icons/fi";

export default function Header() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            TSTCommerce
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900"
            >
              Products
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                >
                  <FiUser />
                  {user.name || user.email}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <FiShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-2">
            <Link
              href="/"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Cart
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user.name || user.email}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    router.push("/");
                  }}
                  className="block py-2 text-red-600 flex items-center gap-2"
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block py-2 text-blue-600 font-semibold"
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
