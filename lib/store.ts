import { create } from "zustand";
import type { Product } from "@/lib/products";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  isCartOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  isCartOpen: false,
  items: [],
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  addItem: (product) => {
    if (!product.inStock) {
      return;
    }

    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      if (!existing) {
        return { items: [...state.items, { product, quantity: 1 }] };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };
    });
  },
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  clearCart: () => set({ items: [] }),
  subtotal: () =>
    get().items.reduce((sum, item) => {
      const discount = item.product.discountPercent ?? 0;
      const price = item.product.price * (1 - discount / 100);
      return sum + price * item.quantity;
    }, 0),
}));
