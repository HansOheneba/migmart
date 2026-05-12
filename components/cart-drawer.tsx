"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { formatCurrency } from "@/lib/utils";

type CartDrawerProps = {
  onCheckout: () => void;
};

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const {
    isCartOpen,
    closeCart,
    items,
    setQuantity,
    removeItem,
    subtotal,
  } = useCartStore();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const total = subtotal();

  return (
    <>
      {isCartOpen ? (
        <button
          className="fixed inset-0 z-40 bg-black/30"
          onClick={closeCart}
          aria-label="Close cart overlay"
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-black/10 bg-white shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-black/10 px-4">
          <h2 className="font-heading text-2xl text-(--ink-900)">Your Cart</h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto p-4" style={{ height: "calc(100% - 190px)" }}>
          {items.length === 0 ? (
            <p className="rounded-xl bg-(--sand-100) p-4 text-sm text-(--ink-600)">
              Your cart is empty. Add fresh picks from the catalog.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="rounded-xl border border-black/10 p-3">
                <p className="font-semibold text-(--ink-900)">{item.product.name}</p>
                <p className="text-xs text-(--ink-500)">{formatCurrency(item.product.price)} each</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-full border border-black/10 p-1"
                      onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      className="rounded-full border border-black/10 p-1"
                      onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-xs font-medium text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-black/10 p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-(--ink-500)">Subtotal</span>
            <span className="font-semibold text-(--ink-900)">{formatCurrency(total)}</span>
          </div>
          <Button className="w-full" onClick={() => setShowCheckoutModal(true)} disabled={items.length === 0}>
            Proceed to Checkout
          </Button>
        </div>
      </aside>

      <ConfirmModal
        open={showCheckoutModal}
        title="Confirm your order?"
        description={`Your total is ${formatCurrency(total)}. You'll earn loyalty points based on your spend.`}
        confirmLabel="Place order"
        cancelLabel="Review cart"
        onConfirm={() => {
          setShowCheckoutModal(false);
          closeCart();
          onCheckout();
        }}
        onCancel={() => setShowCheckoutModal(false)}
      />
    </>
  );
}
