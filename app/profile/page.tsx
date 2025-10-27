"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth-store";
import {
  FiUser,
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiArrowRight,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  orderItems?: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image: string;
    };
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    async function fetchOrders() {
      if (!user) return;

      try {
        const response = await fetch(`/api/orders?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FiUser className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {user.name || "User"}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Account Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Orders</span>
                    <span className="font-semibold text-gray-800">
                      {orders.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Spent</span>
                    <span className="font-semibold text-gray-800">
                      $
                      {orders
                        .reduce((sum, order) => sum + order.total, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiPackage />
                  Order History
                </h2>
                <Link
                  href="/products"
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Continue Shopping →
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start shopping to see your order history here
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <FiPackage className="text-blue-600" />
                            <span className="font-semibold text-gray-800">
                              Order #{order.id.slice(-8)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <FiCalendar />
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiDollarSign />
                              <span className="font-semibold">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                              ? "bg-green-100 text-green-800"
                              : order.status === "delivered"
                              ? "bg-green-200 text-green-900"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="border-t pt-4">
                          <div className="flex items-start gap-3">
                            {order.orderItems.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                className="relative w-16 h-16 bg-gray-100 rounded"
                              >
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover rounded"
                                  sizes="64px"
                                />
                              </div>
                            ))}
                            {order.orderItems.length > 3 && (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-600 font-semibold">
                                  +{order.orderItems.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/checkout/success?orderId=${order.id}`}
                        className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Details <FiArrowRight />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
