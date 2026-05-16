"use client";

import { create } from "zustand";
import type { CartItem, User } from "@/types";

interface Store {
  // Auth
  user: User | null;
  setUser: (u: User | null) => void;

  // Cart
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Checkout
  checkoutStep: null | "review" | "processing" | "done";
  setCheckoutStep: (s: Store["checkoutStep"]) => void;

  // UI
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  authModal: null | "login" | "register" | "forgot";
  setAuthModal: (v: Store["authModal"]) => void;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  setUser: (u) => set({ user: u }),

  cart: [],
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  addToCart: (item) =>
    set((s) => {
      const existing = s.cart.find((c) => c.id === item.id);
      if (existing) {
        return { cart: s.cart.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) };
      }
      return { cart: [...s.cart, { ...item, qty: 1 }] };
    }),
  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
  updateQty: (id, qty) =>
    set((s) => ({
      cart: qty <= 0
        ? s.cart.filter((c) => c.id !== id)
        : s.cart.map((c) => c.id === id ? { ...c, qty } : c),
    })),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((sum, c) => sum + c.price * c.qty, 0),
  cartCount: () => get().cart.reduce((sum, c) => sum + c.qty, 0),

  checkoutStep: null,
  setCheckoutStep: (s) => set({ checkoutStep: s }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  authModal: null,
  setAuthModal: (v) => set({ authModal: v }),
}));
