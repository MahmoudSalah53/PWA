"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, CartItem } from "@/types/product";

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set({ orders: [...get().orders, order] });
      },
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: "order-storage",
    }
  )
);
